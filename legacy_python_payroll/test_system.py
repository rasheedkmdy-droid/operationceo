import os
import sys
from app.database import init_db, get_db
from seed_data import seed_msme_data
from app.engine.payroll_calculator import calculate_employee_payroll
from app.reports.payslip_pdf import generate_payslip_pdf_bytes
from app.reports.bank_export import generate_bank_disbursement_excel
from app.reports.wage_register import generate_wage_register_excel

def test_full_payroll_flow():
    print("--- [1] Initializing Database & Seeding Data ---")
    init_db()
    seed_msme_data()

    conn = get_db()
    emp_count = conn.execute("SELECT COUNT(*) as cnt FROM employees").fetchone()["cnt"]
    print(f"Total employees in database: {emp_count}")
    assert emp_count == 10, f"Expected 10 employees, got {emp_count}"

    print("--- [2] Testing Statutory Calculations on 10 Employees ---")
    employees = [dict(r) for r in conn.execute("SELECT * FROM employees").fetchall()]
    company = dict(conn.execute("SELECT * FROM company_profile WHERE id = 1").fetchone())

    # Check EMP001 (High Gross - 85k, exempt from ESI)
    emp1 = next(e for e in employees if e["id"] == "EMP001")
    att1 = {"total_working_days": 26, "lop_days": 0, "bonus_incentive": 0, "overtime_hours": 0, "tds_deduction": 3500}
    calc1 = calculate_employee_payroll(emp1, att1)
    print(f"EMP001 Earned Gross: Rs.{calc1['earned_gross']}, PF: Rs.{calc1['ded_pf']}, ESI: Rs.{calc1['ded_esi']}, Net: Rs.{calc1['net_pay']}")
    assert calc1["ded_esi"] == 0, "EMP001 should be exempt from ESI"
    assert calc1["ded_pf"] == 1800.0, f"EMP001 PF should be capped at 1800 (15000 ceiling), got {calc1['ded_pf']}"

    # Check EMP008 (Gross 19,500 <= 21,000 -> ESIC applicable!)
    emp8 = next(e for e in employees if e["id"] == "EMP008")
    att8 = {"total_working_days": 26, "lop_days": 0, "bonus_incentive": 0, "overtime_hours": 0, "tds_deduction": 0}
    calc8 = calculate_employee_payroll(emp8, att8)
    print(f"EMP008 Earned Gross: Rs.{calc8['earned_gross']}, PF: Rs.{calc8['ded_pf']}, ESI: Rs.{calc8['ded_esi']}, Net: Rs.{calc8['net_pay']}")
    assert calc8["ded_esi"] > 0, "EMP008 should have ESIC deduction!"
    assert calc8["ded_pf"] == round(9750.0 * 0.12, 2), f"EMP008 PF expected {9750 * 0.12}, got {calc8['ded_pf']}"

    # Check EMP003 (with 1 day LOP and Rs.3000 bonus)
    emp3 = next(e for e in employees if e["id"] == "EMP003")
    att3 = {"total_working_days": 26, "lop_days": 1, "bonus_incentive": 3000, "overtime_hours": 0, "tds_deduction": 500}
    calc3 = calculate_employee_payroll(emp3, att3)
    print(f"EMP003 Payable Days: {calc3['payable_days']}, Gross: Rs.{calc3['earned_gross']}, Net: Rs.{calc3['net_pay']}")
    assert calc3["payable_days"] == 25, "EMP003 should have 25 payable days"

    print("--- [3] Testing PDF Payslip Generation ---")
    payslip_data = {**calc1, "month_str": "2026-10"}
    pdf_bytes = generate_payslip_pdf_bytes(company, emp1, payslip_data)
    print(f"Generated PDF bytes length: {len(pdf_bytes)} bytes")
    assert len(pdf_bytes) > 2000, "PDF should not be empty"

    print("--- [4] Testing Bank Disbursement Excel Generation ---")
    payout_records = [
        {"id": emp["id"], "full_name": emp["full_name"], "bank_name": emp["bank_name"],
         "account_number": emp["account_number"], "ifsc_code": emp["ifsc_code"], "net_pay": 45000.0}
        for emp in employees
    ]
    bank_bytes = generate_bank_disbursement_excel("2026-10", company, payout_records)
    print(f"Generated Bank Excel bytes length: {len(bank_bytes)} bytes")
    assert len(bank_bytes) > 1000, "Bank Excel should not be empty"

    print("--- [5] Testing Wage Register (Form T) Excel Generation ---")
    wage_rows = [{**calc1, "full_name": emp1["full_name"], "department": emp1["department"], "designation": emp1["designation"]}]
    wage_bytes = generate_wage_register_excel("2026-10", company, wage_rows)
    print(f"Generated Wage Register bytes length: {len(wage_bytes)} bytes")
    assert len(wage_bytes) > 1000, "Wage Register should not be empty"

    conn.close()
    print("ALL VERIFICATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_full_payroll_flow()
