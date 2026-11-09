import io
from typing import List, Dict, Any
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def generate_wage_register_excel(month_str: str, company: Dict[str, Any], rows: List[Dict[str, Any]]) -> bytes:
    """
    Generates a Comprehensive Monthly Salary & Wage Register (Form T / Labor Law Compliant)
    for MSME audit, accounting, and compliance archives.
    """
    wb = Workbook()
    ws = wb.active
    ws.title = f"Wage_Register_{month_str}"
    ws.views.sheetView[0].showGridLines = True

    # Styling
    title_fill = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    title_font = Font(name="Calibri", size=13, bold=True, color="FFFFFF")
    
    header_fill = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
    header_font = Font(name="Calibri", size=10, bold=True, color="FFFFFF")

    total_fill = PatternFill(start_color="E2E8F0", end_color="E2E8F0", fill_type="solid")
    total_font = Font(name="Calibri", size=10, bold=True, color="000000")

    border_thin = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )

    border_double = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='double', color='000000')
    )

    # Title block
    ws.merge_cells('A1:R1')
    ws['A1'] = f"{company.get('company_name', 'MSME Corp')} - MONTHLY WAGE REGISTER (FORM T)"
    ws['A1'].fill = title_fill
    ws['A1'].font = title_font
    ws['A1'].alignment = Alignment(horizontal='center', vertical='center')

    ws.merge_cells('A2:R2')
    ws['A2'] = f"Month: {month_str} | Udyam Reg: {company.get('udyam_reg_no', 'N/A')} | PF Code: {company.get('pf_code', 'N/A')} | ESIC: {company.get('esic_code', 'N/A')}"
    ws['A2'].alignment = Alignment(horizontal='center', vertical='center')
    ws['A2'].font = Font(name="Calibri", size=10, italic=True)

    headers = [
        "EMP ID", "Full Name", "Department", "Designation",
        "Total Days", "Payable Days", "LOP",
        "Earned Basic", "Earned HRA", "Earned Other", "Gross Wages",
        "PF (EPF)", "ESI (ESIC)", "Prof. Tax (PT)", "TDS", "Total Ded.",
        "Net Pay", "Employer Cost (CTC)"
    ]
    ws.append([]) # row 3 blank
    ws.append(headers) # row 4
    header_row_idx = 4

    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=header_row_idx, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center', vertical='center')
        cell.border = border_thin

    # Fill data
    numeric_cols = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    totals = {col: 0.0 for col in numeric_cols}

    for idx, r in enumerate(rows, start=1):
        cur_row = header_row_idx + idx
        other_earnings = (
            float(r.get("earned_conveyance", 0) or 0) +
            float(r.get("earned_special", 0) or 0) +
            float(r.get("earned_medical", 0) or 0) +
            float(r.get("earned_overtime", 0) or 0) +
            float(r.get("earned_bonus", 0) or 0)
        )
        row_vals = [
            r.get("employee_id", ""),
            r.get("full_name", ""),
            r.get("department", ""),
            r.get("designation", ""),
            r.get("total_working_days", 0),
            r.get("payable_days", 0),
            r.get("lop_days", 0),
            float(r.get("earned_basic", 0) or 0),
            float(r.get("earned_hra", 0) or 0),
            other_earnings,
            float(r.get("earned_gross", 0) or 0),
            float(r.get("ded_pf", 0) or 0),
            float(r.get("ded_esi", 0) or 0),
            float(r.get("ded_pt", 0) or 0),
            float(r.get("ded_tds", 0) or 0),
            float(r.get("total_deductions", 0) or 0),
            float(r.get("net_pay", 0) or 0),
            float(r.get("employer_cost", 0) or 0)
        ]
        ws.append(row_vals)

        # accumulate
        for c_idx in numeric_cols:
            totals[c_idx] += float(row_vals[c_idx - 1] or 0)

        for col_idx in range(1, len(headers) + 1):
            cell = ws.cell(row=cur_row, column=col_idx)
            cell.border = border_thin
            if col_idx in [1, 5, 6, 7]:
                cell.alignment = Alignment(horizontal='center')
            elif col_idx in [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]:
                cell.number_format = '#,##0.00'
                cell.alignment = Alignment(horizontal='right')

    # Total row
    tot_row_idx = header_row_idx + len(rows) + 1
    ws.cell(row=tot_row_idx, column=1, value="")
    ws.cell(row=tot_row_idx, column=2, value="TOTAL SUMMARY")
    ws.cell(row=tot_row_idx, column=3, value="")
    ws.cell(row=tot_row_idx, column=4, value="")

    for c_idx in numeric_cols:
        ws.cell(row=tot_row_idx, column=c_idx, value=totals[c_idx])

    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=tot_row_idx, column=col_idx)
        cell.fill = total_fill
        cell.font = total_font
        cell.border = border_double
        if col_idx in [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]:
            cell.number_format = '#,##0.00'
            cell.alignment = Alignment(horizontal='right')
        elif col_idx in [5, 6, 7]:
            cell.alignment = Alignment(horizontal='center')

    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 3, 11)

    buffer = io.BytesIO()
    wb.save(buffer)
    excel_bytes = buffer.getvalue()
    buffer.close()
    return excel_bytes
