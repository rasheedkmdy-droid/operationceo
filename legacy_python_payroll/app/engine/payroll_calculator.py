from typing import Dict, Any
import math

def calculate_employee_payroll(employee: Dict[str, Any], attendance: Dict[str, Any], pt_default: float = 200.0) -> Dict[str, Any]:
    """
    Computes pro-rated earnings, statutory deductions, employer contributions,
    and net take-home salary according to Indian MSME rules.
    """
    # 1. Attendance & Payable Days
    total_working_days = int(attendance.get("total_working_days", 26) or 26)
    lop_days = float(attendance.get("lop_days", 0.0) or 0.0)
    payable_days = max(0.0, float(total_working_days) - lop_days)
    
    ratio = (payable_days / total_working_days) if total_working_days > 0 else 1.0
    # Guard against ratio > 1.0
    ratio = min(1.0, max(0.0, ratio))

    # 2. Base Components
    base_basic = float(employee.get("basic_salary", 0.0) or 0.0)
    base_hra = float(employee.get("hra", 0.0) or 0.0)
    base_conveyance = float(employee.get("conveyance_allowance", 0.0) or 0.0)
    base_special = float(employee.get("special_allowance", 0.0) or 0.0)
    base_medical = float(employee.get("medical_allowance", 0.0) or 0.0)
    fixed_gross = float(employee.get("fixed_gross", 0.0) or 0.0)

    # Variables for the month
    overtime_hours = float(attendance.get("overtime_hours", 0.0) or 0.0)
    overtime_rate = float(attendance.get("overtime_rate", 0.0) or 0.0)
    bonus_incentive = float(attendance.get("bonus_incentive", 0.0) or 0.0)
    advance_deduction = float(attendance.get("advance_deduction", 0.0) or 0.0)
    monthly_tds = float(attendance.get("tds_deduction", 0.0) or employee.get("monthly_tds", 0.0) or 0.0)

    # 3. Earned Gross Components (Pro-rated for LOP)
    earned_basic = round(base_basic * ratio, 2)
    earned_hra = round(base_hra * ratio, 2)
    earned_conveyance = round(base_conveyance * ratio, 2)
    earned_special = round(base_special * ratio, 2)
    earned_medical = round(base_medical * ratio, 2)
    earned_overtime = round(overtime_hours * overtime_rate, 2)
    earned_bonus = round(bonus_incentive, 2)

    earned_gross = round(
        earned_basic + earned_hra + earned_conveyance + earned_special + earned_medical + earned_overtime + earned_bonus,
        2
    )

    # 4. Statutory Deductions
    # Provident Fund (PF): 12% on Basic (Statutory cap ₹15,000 basic = max ₹1,800/mo, or 12% of earned basic)
    pf_opted = bool(employee.get("pf_opted", 1))
    ded_pf = 0.0
    employer_pf = 0.0
    if pf_opted and earned_basic > 0:
        # Standard statutory ceiling rule: 12% on basic capped at 15000 or actual if basic <= 15000
        pf_wage = min(earned_basic, 15000.0) if base_basic > 15000.0 else earned_basic
        ded_pf = round(pf_wage * 0.12, 2)
        employer_pf = ded_pf # 12% employer matching

    # Employee State Insurance (ESIC): Applicable only if fixed gross <= ₹21,000
    esic_opted = bool(employee.get("esic_opted", 1))
    ded_esi = 0.0
    employer_esi = 0.0
    if esic_opted and (fixed_gross <= 21000.0 or earned_gross <= 21000.0) and earned_gross > 0:
        # 0.75% Employee share
        ded_esi = round(math.ceil(earned_gross * 0.0075 * 100) / 100, 2)
        # 3.25% Employer share
        employer_esi = round(math.ceil(earned_gross * 0.0325 * 100) / 100, 2)

    # Professional Tax (PT): Standard slab (exempt if salary low, else ₹200)
    emp_pt = float(employee.get("monthly_pt", pt_default) or pt_default)
    if earned_gross < 7500.0:
        ded_pt = 0.0
    elif earned_gross < 10000.0:
        ded_pt = min(emp_pt, 175.0)
    else:
        ded_pt = emp_pt

    # Total Deductions
    total_deductions = round(ded_pf + ded_esi + ded_pt + monthly_tds + advance_deduction, 2)

    # 5. Net Take-Home Pay
    net_pay = round(max(0.0, earned_gross - total_deductions), 2)

    # 6. Total Employer Cost (CTC for Month)
    employer_cost = round(earned_gross + employer_pf + employer_esi, 2)

    return {
        "employee_id": employee.get("id"),
        "total_working_days": total_working_days,
        "payable_days": payable_days,
        "lop_days": lop_days,
        "earned_basic": earned_basic,
        "earned_hra": earned_hra,
        "earned_conveyance": earned_conveyance,
        "earned_special": earned_special,
        "earned_medical": earned_medical,
        "earned_overtime": earned_overtime,
        "earned_bonus": earned_bonus,
        "earned_gross": earned_gross,
        "ded_pf": ded_pf,
        "ded_esi": ded_esi,
        "ded_pt": ded_pt,
        "ded_tds": monthly_tds,
        "ded_advance": advance_deduction,
        "total_deductions": total_deductions,
        "net_pay": net_pay,
        "employer_pf": employer_pf,
        "employer_esi": employer_esi,
        "employer_cost": employer_cost
    }
