import io
from typing import List, Dict, Any
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def generate_bank_disbursement_excel(month_str: str, company: Dict[str, Any], payout_records: List[Dict[str, Any]]) -> bytes:
    """
    Generates an Excel workbook formatted for Bulk Net Banking NEFT/RTGS salary upload.
    Compatible with HDFC, ICICI, SBI, Axis corporate banking upload sheets.
    """
    wb = Workbook()
    ws = wb.active
    ws.title = f"Bank_Payout_{month_str}"
    ws.views.sheetView[0].showGridLines = True

    # Styling
    header_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    
    sub_title_font = Font(name="Calibri", size=10, italic=True, color="475569")
    company_title_font = Font(name="Calibri", size=14, bold=True, color="0F172A")
    total_font = Font(name="Calibri", size=11, bold=True, color="000000")
    total_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")

    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )
    double_bottom_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='double', color='000000')
    )

    # Title Block
    ws.merge_cells('A1:H1')
    ws['A1'] = f"{company.get('company_name', 'MSME Enterprise')} - BANK SALARY DISBURSEMENT SHEET"
    ws['A1'].font = company_title_font
    ws['A1'].alignment = Alignment(horizontal='center', vertical='center')

    ws.merge_cells('A2:H2')
    ws['A2'] = f"Pay Period: {month_str} | Generated for Net Banking Bulk Upload (NEFT/IMPS)"
    ws['A2'].font = sub_title_font
    ws['A2'].alignment = Alignment(horizontal='center', vertical='center')

    ws.append([]) # Row 3 blank

    # Column Headers
    headers = [
        "Sr No",
        "Employee ID",
        "Beneficiary Name",
        "Bank Name",
        "Account Number",
        "IFSC Code",
        "Net Amount (INR)",
        "Remarks / Narration"
    ]
    ws.append(headers)
    header_row_idx = 4

    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=header_row_idx, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center' if col_idx in [1, 2, 6] else 'left', vertical='center')
        cell.border = thin_border

    # Data Rows
    total_amount = 0.0
    for idx, rec in enumerate(payout_records, start=1):
        amt = float(rec.get("net_pay", 0.0) or 0.0)
        total_amount += amt
        row_vals = [
            idx,
            rec.get("id", ""),
            rec.get("full_name", ""),
            rec.get("bank_name", ""),
            str(rec.get("account_number", "")),
            rec.get("ifsc_code", ""),
            amt,
            f"Salary {month_str} - {rec.get('id', '')}"
        ]
        ws.append(row_vals)
        cur_row = header_row_idx + idx
        for col_idx in range(1, len(headers) + 1):
            c = ws.cell(row=cur_row, column=col_idx)
            c.border = thin_border
            if col_idx == 1:
                c.alignment = Alignment(horizontal='center')
            elif col_idx in [2, 6]:
                c.alignment = Alignment(horizontal='center')
            elif col_idx == 7:
                c.number_format = '#,##0.00'
                c.alignment = Alignment(horizontal='right')
            elif col_idx == 5:
                # Text format for account number to prevent scientific notation
                c.number_format = '@'

    # Total Row
    tot_row_idx = header_row_idx + len(payout_records) + 1
    ws.cell(row=tot_row_idx, column=1, value="")
    ws.cell(row=tot_row_idx, column=2, value="")
    ws.cell(row=tot_row_idx, column=3, value="TOTAL DISBURSEMENT")
    ws.cell(row=tot_row_idx, column=4, value="")
    ws.cell(row=tot_row_idx, column=5, value="")
    ws.cell(row=tot_row_idx, column=6, value="")
    
    tot_amt_cell = ws.cell(row=tot_row_idx, column=7, value=total_amount)
    tot_amt_cell.number_format = '#,##0.00'
    ws.cell(row=tot_row_idx, column=8, value=f"{len(payout_records)} Beneficiaries")

    for col_idx in range(1, len(headers) + 1):
        c = ws.cell(row=tot_row_idx, column=col_idx)
        c.font = total_font
        c.fill = total_fill
        c.border = double_bottom_border
        if col_idx == 7:
            c.alignment = Alignment(horizontal='right')

    # Auto-adjust column widths
    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

    buffer = io.BytesIO()
    wb.save(buffer)
    excel_bytes = buffer.getvalue()
    buffer.close()
    return excel_bytes
