import os
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, Request, Form, Query, HTTPException, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.database import get_db, init_db
from app.engine.payroll_calculator import calculate_employee_payroll
from app.reports.payslip_pdf import generate_payslip_pdf_bytes
from app.reports.bank_export import generate_bank_disbursement_excel
from app.reports.wage_register import generate_wage_register_excel

# Initialize Database Schema
init_db()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI(title="MSME Payroll Management System", version="1.0.0")

# Mount Static Files and Templates
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

def get_current_month() -> str:
    """Returns default active pay period (YYYY-MM)."""
    return "2026-10"

def get_company_data():
    conn = get_db()
    row = conn.execute("SELECT * FROM company_profile WHERE id = 1").fetchone()
    conn.close()
    return dict(row) if row else {}

def ensure_month_payroll(month_str: str):
    """
    Ensures that attendance records and payroll draft exist for the requested month.
    """
    conn = get_db()
    cursor = conn.cursor()

    # 1. Fetch all active employees
    employees = [dict(r) for r in cursor.execute("SELECT * FROM employees WHERE status = 'ACTIVE'").fetchall()]

    # 2. Ensure monthly attendance exists for each
    for emp in employees:
        cursor.execute("SELECT id FROM monthly_attendance WHERE employee_id = ? AND month_str = ?", (emp["id"], month_str))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO monthly_attendance (
                employee_id, month_str, total_working_days, days_present, paid_leaves,
                lop_days, overtime_hours, overtime_rate, bonus_incentive, advance_deduction,
                tds_deduction, remarks
            ) VALUES (?, ?, 26, 26, 0, 0, 0, 0, 0, 0, ?, 'Regular')
            """, (emp["id"], month_str, emp.get("monthly_tds", 0.0)))

    # 3. Check if payroll_runs exists
    cursor.execute("SELECT * FROM payroll_runs WHERE month_str = ?", (month_str,))
    run_row = cursor.fetchone()
    
    if not run_row:
        # Create draft run
        cursor.execute("""
        INSERT INTO payroll_runs (month_str, status, processed_at, employee_count)
        VALUES (?, 'DRAFT', ?, ?)
        """, (month_str, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), len(employees)))
        run_id = cursor.lastrowid
        conn.commit()
        # Compute calculations
        _recompute_payroll_internal(conn, month_str)
    else:
        conn.commit()

    conn.close()

def _recompute_payroll_internal(conn, month_str: str):
    """Internal helper to compute and save payslip records and run summary."""
    cursor = conn.cursor()
    company = dict(cursor.execute("SELECT * FROM company_profile WHERE id = 1").fetchone() or {})
    pt_default = float(company.get("pt_default_amount", 200.0) or 200.0)

    # Get payroll run id
    run = cursor.execute("SELECT id FROM payroll_runs WHERE month_str = ?", (month_str,)).fetchone()
    if not run:
        cursor.execute("INSERT INTO payroll_runs (month_str, status) VALUES (?, 'DRAFT')", (month_str,))
        run_id = cursor.lastrowid
    else:
        run_id = run["id"]

    # Delete existing payslips for this run to recalculate
    cursor.execute("DELETE FROM payslips WHERE month_str = ?", (month_str,))

    employees = [dict(r) for r in cursor.execute("SELECT * FROM employees WHERE status = 'ACTIVE'").fetchall()]
    
    tot_gross = 0.0
    tot_ded = 0.0
    tot_net = 0.0
    tot_er_pf = 0.0
    tot_er_esi = 0.0
    tot_ctc = 0.0

    for emp in employees:
        att = cursor.execute("SELECT * FROM monthly_attendance WHERE employee_id = ? AND month_str = ?", (emp["id"], month_str)).fetchone()
        att_dict = dict(att) if att else {}
        calc = calculate_employee_payroll(emp, att_dict, pt_default)

        cursor.execute("""
        INSERT INTO payslips (
            payroll_run_id, employee_id, month_str, total_working_days, payable_days, lop_days,
            earned_basic, earned_hra, earned_conveyance, earned_special, earned_medical,
            earned_overtime, earned_bonus, earned_gross,
            ded_pf, ded_esi, ded_pt, ded_tds, ded_advance, total_deductions,
            net_pay, employer_pf, employer_esi, employer_cost, status, created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, 'COMPUTED', ?
        )
        """, (
            run_id, emp["id"], month_str, calc["total_working_days"], calc["payable_days"], calc["lop_days"],
            calc["earned_basic"], calc["earned_hra"], calc["earned_conveyance"], calc["earned_special"], calc["earned_medical"],
            calc["earned_overtime"], calc["earned_bonus"], calc["earned_gross"],
            calc["ded_pf"], calc["ded_esi"], calc["ded_pt"], calc["ded_tds"], calc["ded_advance"], calc["total_deductions"],
            calc["net_pay"], calc["employer_pf"], calc["employer_esi"], calc["employer_cost"],
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))

        tot_gross += calc["earned_gross"]
        tot_ded += calc["total_deductions"]
        tot_net += calc["net_pay"]
        tot_er_pf += calc["employer_pf"]
        tot_er_esi += calc["employer_esi"]
        tot_ctc += calc["employer_cost"]

    # Update payroll_runs
    cursor.execute("""
    UPDATE payroll_runs
    SET total_gross = ?, total_deductions = ?, total_net_pay = ?,
        total_employer_pf = ?, total_employer_esi = ?, total_ctc = ?,
        employee_count = ?, processed_at = ?
    WHERE id = ?
    """, (
        round(tot_gross, 2), round(tot_ded, 2), round(tot_net, 2),
        round(tot_er_pf, 2), round(tot_er_esi, 2), round(tot_ctc, 2),
        len(employees), datetime.now().strftime("%Y-%m-%d %H:%M:%S"), run_id
    ))
    conn.commit()


# ==========================================
# 1. DASHBOARD VIEW
# ==========================================
@app.get("/", response_class=HTMLResponse)
async def dashboard_view(request: Request, month: Optional[str] = None):
    active_month = month or get_current_month()
    ensure_month_payroll(active_month)
    company = get_company_data()

    conn = get_db()
    run = conn.execute("SELECT * FROM payroll_runs WHERE month_str = ?", (active_month,)).fetchone()
    run_dict = dict(run) if run else {}

    # Query payslips joined with employees
    slips = [dict(r) for r in conn.execute("""
    SELECT p.*, e.full_name, e.department, e.designation, e.fixed_gross, e.bank_name, e.account_number, e.esic_opted
    FROM payslips p
    JOIN employees e ON p.employee_id = e.id
    WHERE p.month_str = ?
    ORDER BY e.id ASC
    """, (active_month,)).fetchall()]

    # Compute statutory totals for cards
    tot_pf_ee = sum(s.get("ded_pf", 0.0) for s in slips)
    tot_pf_er = sum(s.get("employer_pf", 0.0) for s in slips)
    tot_esi_ee = sum(s.get("ded_esi", 0.0) for s in slips)
    tot_esi_er = sum(s.get("employer_esi", 0.0) for s in slips)
    tot_pt = sum(s.get("ded_pt", 0.0) for s in slips)
    tot_tds = sum(s.get("ded_tds", 0.0) for s in slips)

    stats = {
        "employee_count": run_dict.get("employee_count", len(slips)),
        "total_gross": run_dict.get("total_gross", 0.0),
        "total_deductions": run_dict.get("total_deductions", 0.0),
        "total_net_pay": run_dict.get("total_net_pay", 0.0),
        "total_ctc": run_dict.get("total_ctc", 0.0),
        "status": run_dict.get("status", "DRAFT"),
        "total_pf_ee": tot_pf_ee,
        "total_pf_er": tot_pf_er,
        "total_esi_ee": tot_esi_ee,
        "total_esi_er": tot_esi_er,
        "total_pt": tot_pt,
        "total_tds": tot_tds
    }

    conn.close()
    return templates.TemplateResponse(request=request, name="dashboard.html", context={
        "title": f"Payroll Dashboard - {active_month}",
        "active_page": "dashboard",
        "active_month": active_month,
        "company": company,
        "stats": stats,
        "employee_rows": slips
    })


# ==========================================
# 2. EMPLOYEES MASTER
# ==========================================
@app.get("/employees", response_class=HTMLResponse)
async def employees_view(request: Request, month: Optional[str] = None):
    active_month = month or get_current_month()
    company = get_company_data()

    conn = get_db()
    employees = [dict(r) for r in conn.execute("SELECT * FROM employees ORDER BY id ASC").fetchall()]
    conn.close()

    return templates.TemplateResponse(request=request, name="employees.html", context={
        "title": "Employee Master Directory",
        "active_page": "employees",
        "active_month": active_month,
        "company": company,
        "employees": employees
    })

@app.post("/employees/save")
async def save_employee(
    request: Request,
    id: str = Form(...),
    full_name: str = Form(...),
    email: Optional[str] = Form(""),
    phone: Optional[str] = Form(""),
    department: str = Form(...),
    designation: str = Form(...),
    date_of_joining: str = Form(...),
    bank_name: str = Form(...),
    account_number: str = Form(...),
    ifsc_code: str = Form(...),
    pan_number: str = Form(...),
    aadhaar_number: Optional[str] = Form(""),
    uan_number: Optional[str] = Form(""),
    esic_number: Optional[str] = Form(""),
    pf_opted: Optional[int] = Form(0),
    esic_opted: Optional[int] = Form(0),
    tax_regime: Optional[str] = Form("NEW"),
    fixed_gross: float = Form(...),
    basic_salary: float = Form(...),
    hra: float = Form(...),
    conveyance_allowance: Optional[float] = Form(0.0),
    special_allowance: Optional[float] = Form(0.0),
    medical_allowance: Optional[float] = Form(0.0),
    monthly_pt: Optional[float] = Form(200.0),
    monthly_tds: Optional[float] = Form(0.0)
):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO employees (
        id, full_name, email, phone, department, designation, date_of_joining,
        bank_name, account_number, ifsc_code, pan_number, aadhaar_number,
        uan_number, esic_number, pf_opted, esic_opted, tax_regime,
        fixed_gross, basic_salary, hra, conveyance_allowance, special_allowance,
        medical_allowance, monthly_pt, monthly_tds
    ) VALUES (
        :id, :full_name, :email, :phone, :department, :designation, :date_of_joining,
        :bank_name, :account_number, :ifsc_code, :pan_number, :aadhaar_number,
        :uan_number, :esic_number, :pf_opted, :esic_opted, :tax_regime,
        :fixed_gross, :basic_salary, :hra, :conveyance_allowance, :special_allowance,
        :medical_allowance, :monthly_pt, :monthly_tds
    )
    ON CONFLICT(id) DO UPDATE SET
        full_name=excluded.full_name, email=excluded.email, phone=excluded.phone,
        department=excluded.department, designation=excluded.designation, date_of_joining=excluded.date_of_joining,
        bank_name=excluded.bank_name, account_number=excluded.account_number, ifsc_code=excluded.ifsc_code,
        pan_number=excluded.pan_number, aadhaar_number=excluded.aadhaar_number,
        uan_number=excluded.uan_number, esic_number=excluded.esic_number,
        pf_opted=excluded.pf_opted, esic_opted=excluded.esic_opted, tax_regime=excluded.tax_regime,
        fixed_gross=excluded.fixed_gross, basic_salary=excluded.basic_salary, hra=excluded.hra,
        conveyance_allowance=excluded.conveyance_allowance, special_allowance=excluded.special_allowance,
        medical_allowance=excluded.medical_allowance, monthly_pt=excluded.monthly_pt, monthly_tds=excluded.monthly_tds
    """, {
        "id": id.strip().upper(), "full_name": full_name.strip(), "email": email, "phone": phone,
        "department": department.strip(), "designation": designation.strip(), "date_of_joining": date_of_joining,
        "bank_name": bank_name.strip(), "account_number": account_number.strip(), "ifsc_code": ifsc_code.strip().upper(),
        "pan_number": pan_number.strip().upper(), "aadhaar_number": aadhaar_number, "uan_number": uan_number,
        "esic_number": esic_number, "pf_opted": 1 if pf_opted else 0, "esic_opted": 1 if esic_opted else 0,
        "tax_regime": tax_regime, "fixed_gross": fixed_gross, "basic_salary": basic_salary, "hra": hra,
        "conveyance_allowance": conveyance_allowance, "special_allowance": special_allowance,
        "medical_allowance": medical_allowance, "monthly_pt": monthly_pt, "monthly_tds": monthly_tds
    })

    conn.commit()
    conn.close()
    return RedirectResponse(url="/employees", status_code=303)

@app.post("/employees/delete/{emp_id}")
async def delete_employee(emp_id: str):
    conn = get_db()
    conn.execute("DELETE FROM employees WHERE id = ?", (emp_id,))
    conn.commit()
    conn.close()
    return RedirectResponse(url="/employees", status_code=303)


# ==========================================
# 3. ATTENDANCE & ADJUSTMENTS
# ==========================================
@app.get("/attendance", response_class=HTMLResponse)
async def attendance_view(request: Request, month: Optional[str] = None):
    active_month = month or get_current_month()
    ensure_month_payroll(active_month)
    company = get_company_data()

    conn = get_db()
    rows = [dict(r) for r in conn.execute("""
    SELECT a.*, e.full_name, e.designation, e.fixed_gross
    FROM monthly_attendance a
    JOIN employees e ON a.employee_id = e.id
    WHERE a.month_str = ?
    ORDER BY e.id ASC
    """, (active_month,)).fetchall()]
    conn.close()

    return templates.TemplateResponse(request=request, name="attendance.html", context={
        "title": f"Monthly Attendance - {active_month}",
        "active_page": "attendance",
        "active_month": active_month,
        "company": company,
        "attendance_rows": rows
    })

@app.post("/attendance/save")
async def save_attendance(request: Request, month: Optional[str] = None):
    active_month = month or get_current_month()
    form = await request.form()
    
    conn = get_db()
    cursor = conn.cursor()

    emp_ids = form.getlist("emp_id")
    for eid in emp_ids:
        total_days = int(form.get(f"total_days_{eid}", 26) or 26)
        lop_days = float(form.get(f"lop_days_{eid}", 0.0) or 0.0)
        ot_hrs = float(form.get(f"ot_hrs_{eid}", 0.0) or 0.0)
        ot_rate = float(form.get(f"ot_rate_{eid}", 0.0) or 0.0)
        bonus = float(form.get(f"bonus_{eid}", 0.0) or 0.0)
        advance = float(form.get(f"advance_{eid}", 0.0) or 0.0)
        tds = float(form.get(f"tds_{eid}", 0.0) or 0.0)
        
        present_days = max(0.0, float(total_days) - lop_days)

        cursor.execute("""
        UPDATE monthly_attendance
        SET total_working_days = ?, days_present = ?, lop_days = ?,
            overtime_hours = ?, overtime_rate = ?, bonus_incentive = ?,
            advance_deduction = ?, tds_deduction = ?
        WHERE employee_id = ? AND month_str = ?
        """, (total_days, present_days, lop_days, ot_hrs, ot_rate, bonus, advance, tds, eid, active_month))

    # Trigger recompute
    _recompute_payroll_internal(conn, active_month)
    conn.close()

    return RedirectResponse(url=f"/payroll?month={active_month}", status_code=303)


# ==========================================
# 4. PAYROLL RUN & APPROVAL
# ==========================================
@app.get("/payroll", response_class=HTMLResponse)
async def payroll_view(request: Request, month: Optional[str] = None):
    active_month = month or get_current_month()
    ensure_month_payroll(active_month)
    company = get_company_data()

    conn = get_db()
    run = conn.execute("SELECT * FROM payroll_runs WHERE month_str = ?", (active_month,)).fetchone()
    run_dict = dict(run) if run else {}

    slips = [dict(r) for r in conn.execute("""
    SELECT p.*, e.full_name, e.designation, e.department
    FROM payslips p
    JOIN employees e ON p.employee_id = e.id
    WHERE p.month_str = ?
    ORDER BY e.id ASC
    """, (active_month,)).fetchall()]
    conn.close()

    return templates.TemplateResponse(request=request, name="payroll_run.html", context={
        "title": f"Payroll Run & Approval - {active_month}",
        "active_page": "payroll",
        "active_month": active_month,
        "company": company,
        "run": run_dict,
        "slips": slips
    })

@app.post("/payroll/compute")
async def compute_payroll_action(month: Optional[str] = None):
    active_month = month or get_current_month()
    conn = get_db()
    _recompute_payroll_internal(conn, active_month)
    conn.close()
    return RedirectResponse(url=f"/payroll?month={active_month}", status_code=303)

@app.post("/payroll/lock")
async def lock_payroll_action(month: Optional[str] = None):
    active_month = month or get_current_month()
    conn = get_db()
    conn.execute("UPDATE payroll_runs SET status = 'LOCKED', locked_at = ? WHERE month_str = ?", (
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"), active_month
    ))
    conn.commit()
    conn.close()
    return RedirectResponse(url=f"/payroll?month={active_month}", status_code=303)

@app.post("/payroll/unlock")
async def unlock_payroll_action(month: Optional[str] = None):
    active_month = month or get_current_month()
    conn = get_db()
    conn.execute("UPDATE payroll_runs SET status = 'DRAFT', locked_at = NULL WHERE month_str = ?", (active_month,))
    conn.commit()
    conn.close()
    return RedirectResponse(url=f"/payroll?month={active_month}", status_code=303)


# ==========================================
# 5. REPORTS & COMPLIANCE
# ==========================================
@app.get("/reports", response_class=HTMLResponse)
async def reports_view(request: Request, month: Optional[str] = None):
    active_month = month or get_current_month()
    ensure_month_payroll(active_month)
    company = get_company_data()

    conn = get_db()
    run = conn.execute("SELECT * FROM payroll_runs WHERE month_str = ?", (active_month,)).fetchone()
    run_dict = dict(run) if run else {}

    slips = [dict(r) for r in conn.execute("""
    SELECT p.*, e.full_name, e.designation, e.department
    FROM payslips p
    JOIN employees e ON p.employee_id = e.id
    WHERE p.month_str = ?
    ORDER BY e.id ASC
    """, (active_month,)).fetchall()]

    tot_pf_ee = sum(s.get("ded_pf", 0.0) for s in slips)
    tot_pf_er = sum(s.get("employer_pf", 0.0) for s in slips)
    tot_esi_ee = sum(s.get("ded_esi", 0.0) for s in slips)
    tot_esi_er = sum(s.get("employer_esi", 0.0) for s in slips)
    tot_pt = sum(s.get("ded_pt", 0.0) for s in slips)
    tot_tds = sum(s.get("ded_tds", 0.0) for s in slips)

    summary = {
        "employee_count": run_dict.get("employee_count", len(slips)),
        "total_gross": run_dict.get("total_gross", 0.0),
        "total_deductions": run_dict.get("total_deductions", 0.0),
        "total_net_pay": run_dict.get("total_net_pay", 0.0),
        "total_ctc": run_dict.get("total_ctc", 0.0),
        "total_pf_ee": tot_pf_ee,
        "total_pf_er": tot_pf_er,
        "total_esi_ee": tot_esi_ee,
        "total_esi_er": tot_esi_er,
        "total_pt": tot_pt,
        "total_tds": tot_tds
    }

    conn.close()
    return templates.TemplateResponse(request=request, name="reports.html", context={
        "title": f"Reports & Compliance - {active_month}",
        "active_page": "reports",
        "active_month": active_month,
        "company": company,
        "summary": summary,
        "slips": slips
    })


# ==========================================
# 6. COMPANY MASTER
# ==========================================
@app.get("/company", response_class=HTMLResponse)
async def company_view(request: Request, month: Optional[str] = None):
    active_month = month or get_current_month()
    company = get_company_data()

    return templates.TemplateResponse(request=request, name="company.html", context={
        "title": "Company & MSME Setup",
        "active_page": "company",
        "active_month": active_month,
        "company": company
    })

@app.post("/company/save")
async def save_company_settings(
    company_name: str = Form(...),
    udyam_reg_no: Optional[str] = Form(""),
    pan_no: Optional[str] = Form(""),
    tan_no: Optional[str] = Form(""),
    gstin: Optional[str] = Form(""),
    address: Optional[str] = Form(""),
    phone: Optional[str] = Form(""),
    email: Optional[str] = Form(""),
    pf_code: Optional[str] = Form(""),
    esic_code: Optional[str] = Form(""),
    pt_state: Optional[str] = Form("Maharashtra"),
    pt_default_amount: Optional[float] = Form(200.0),
    signatory_name: Optional[str] = Form("Authorized Signatory")
):
    conn = get_db()
    conn.execute("""
    UPDATE company_profile
    SET company_name = :company_name, udyam_reg_no = :udyam_reg_no,
        pan_no = :pan_no, tan_no = :tan_no, gstin = :gstin,
        address = :address, phone = :phone, email = :email,
        pf_code = :pf_code, esic_code = :esic_code,
        pt_state = :pt_state, pt_default_amount = :pt_default_amount,
        signatory_name = :signatory_name
    WHERE id = 1
    """, {
        "company_name": company_name.strip(), "udyam_reg_no": udyam_reg_no.strip(),
        "pan_no": pan_no.strip().upper(), "tan_no": tan_no.strip().upper(),
        "gstin": gstin.strip().upper(), "address": address.strip(),
        "phone": phone.strip(), "email": email.strip(),
        "pf_code": pf_code.strip(), "esic_code": esic_code.strip(),
        "pt_state": pt_state.strip(), "pt_default_amount": pt_default_amount or 200.0,
        "signatory_name": signatory_name.strip()
    })
    conn.commit()
    conn.close()
    return RedirectResponse(url="/company", status_code=303)


# ==========================================
# 7. DELIVERABLE EXPORTS & PDF DOWNLOADS
# ==========================================
@app.get("/payslip/pdf/{emp_id}")
async def download_payslip_pdf(emp_id: str, month: Optional[str] = None):
    active_month = month or get_current_month()
    ensure_month_payroll(active_month)

    conn = get_db()
    company = dict(conn.execute("SELECT * FROM company_profile WHERE id = 1").fetchone() or {})
    employee = dict(conn.execute("SELECT * FROM employees WHERE id = ?", (emp_id,)).fetchone() or {})
    payslip = dict(conn.execute("SELECT * FROM payslips WHERE employee_id = ? AND month_str = ?", (emp_id, active_month)).fetchone() or {})
    conn.close()

    if not employee or not payslip:
        raise HTTPException(status_code=404, detail="Employee or payslip record not found.")

    pdf_bytes = generate_payslip_pdf_bytes(company, employee, payslip)
    filename = f"Payslip_{emp_id}_{active_month}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{filename}"'}
    )

@app.get("/export/bank-excel")
async def export_bank_excel(month: Optional[str] = None):
    active_month = month or get_current_month()
    ensure_month_payroll(active_month)

    conn = get_db()
    company = dict(conn.execute("SELECT * FROM company_profile WHERE id = 1").fetchone() or {})
    payout_records = [dict(r) for r in conn.execute("""
    SELECT e.id, e.full_name, e.bank_name, e.account_number, e.ifsc_code, p.net_pay
    FROM payslips p
    JOIN employees e ON p.employee_id = e.id
    WHERE p.month_str = ?
    ORDER BY e.id ASC
    """, (active_month,)).fetchall()]
    conn.close()

    excel_bytes = generate_bank_disbursement_excel(active_month, company, payout_records)
    filename = f"Bank_Disbursement_{active_month}.xlsx"

    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@app.get("/export/wage-register")
async def export_wage_register(month: Optional[str] = None):
    active_month = month or get_current_month()
    ensure_month_payroll(active_month)

    conn = get_db()
    company = dict(conn.execute("SELECT * FROM company_profile WHERE id = 1").fetchone() or {})
    rows = [dict(r) for r in conn.execute("""
    SELECT p.*, e.full_name, e.department, e.designation
    FROM payslips p
    JOIN employees e ON p.employee_id = e.id
    WHERE p.month_str = ?
    ORDER BY e.id ASC
    """, (active_month,)).fetchall()]
    conn.close()

    excel_bytes = generate_wage_register_excel(active_month, company, rows)
    filename = f"Wage_Register_FormT_{active_month}.xlsx"

    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
