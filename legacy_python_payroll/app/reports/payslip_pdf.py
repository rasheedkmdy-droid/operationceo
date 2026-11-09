import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT

def number_to_words_inr(number: float) -> str:
    """Helper to convert amount to Indian Rupee Words format."""
    num = int(round(number))
    if num == 0:
        return "Zero Rupees Only"

    def one_to_19(n):
        return [
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"
        ][n]

    def tens(n):
        return [
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        ][n]

    def words_below_thousand(n):
        h = n // 100
        rem = n % 100
        res = []
        if h > 0:
            res.append(one_to_19(h) + " Hundred")
        if rem > 0:
            if rem < 20:
                res.append(one_to_19(rem))
            else:
                t = rem // 10
                o = rem % 10
                res.append(tens(t) + (" " + one_to_19(o) if o > 0 else ""))
        return " ".join(res)

    crore = num // 10000000
    rem = num % 10000000
    lakh = rem // 100000
    rem = rem % 100000
    thousand = rem // 1000
    rem = rem % 1000

    parts = []
    if crore > 0:
        parts.append(words_below_thousand(crore) + " Crore")
    if lakh > 0:
        parts.append(words_below_thousand(lakh) + " Lakh")
    if thousand > 0:
        parts.append(words_below_thousand(thousand) + " Thousand")
    if rem > 0:
        parts.append(words_below_thousand(rem))

    return "INR " + " ".join(parts) + " Only"

def generate_payslip_pdf_bytes(company: Dict[str, Any], employee: Dict[str, Any], payslip: Dict[str, Any]) -> bytes:
    """Generates an official A4 payslip PDF in memory and returns bytes."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1E293B')
    )
    
    sub_title_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#64748B')
    )
    
    header_box_style = ParagraphStyle(
        'HeaderBox',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#0F172A')
    )

    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#334155')
    )
    
    cell_regular = ParagraphStyle(
        'CellRegular',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#1E293B')
    )
    
    cell_right = ParagraphStyle(
        'CellRight',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        alignment=TA_RIGHT,
        textColor=colors.HexColor('#1E293B')
    )

    cell_right_bold = ParagraphStyle(
        'CellRightBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=10.5,
        alignment=TA_RIGHT,
        textColor=colors.HexColor('#0F172A')
    )

    story = []

    # 1. Company Header
    story.append(Paragraph(company.get("company_name", "Acme MSME Corp"), title_style))
    story.append(Spacer(1, 3))
    address_str = f"{company.get('address', '')} | Phone: {company.get('phone', '')} | Email: {company.get('email', '')}"
    story.append(Paragraph(address_str, sub_title_style))
    statutory_reg = f"MSME Udyam: {company.get('udyam_reg_no', 'N/A')} | PAN: {company.get('pan_no', 'N/A')} | TAN: {company.get('tan_no', 'N/A')} | GSTIN: {company.get('gstin', 'N/A')}"
    story.append(Paragraph(statutory_reg, sub_title_style))
    story.append(Spacer(1, 10))

    # Banner / Pay Period
    month_str = payslip.get("month_str", "")
    story.append(Table(
        [[Paragraph(f"<b>SALARY PAYSLIP FOR THE MONTH OF {month_str.upper()}</b>", header_box_style)]],
        colWidths=[522],
        style=[
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F1F5F9')),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ]
    ))
    story.append(Spacer(1, 8))

    # 2. Employee Details Grid
    emp_details = [
        [
            Paragraph("<b>Employee ID:</b>", cell_bold), Paragraph(str(employee.get("id", "")), cell_regular),
            Paragraph("<b>Name:</b>", cell_bold), Paragraph(str(employee.get("full_name", "")), cell_regular)
        ],
        [
            Paragraph("<b>Department:</b>", cell_bold), Paragraph(str(employee.get("department", "")), cell_regular),
            Paragraph("<b>Designation:</b>", cell_bold), Paragraph(str(employee.get("designation", "")), cell_regular)
        ],
        [
            Paragraph("<b>Date of Joining:</b>", cell_bold), Paragraph(str(employee.get("date_of_joining", "")), cell_regular),
            Paragraph("<b>PAN Number:</b>", cell_bold), Paragraph(str(employee.get("pan_number", "N/A")), cell_regular)
        ],
        [
            Paragraph("<b>UAN (PF No):</b>", cell_bold), Paragraph(str(employee.get("uan_number") or "N/A"), cell_regular),
            Paragraph("<b>ESIC IP No:</b>", cell_bold), Paragraph(str(employee.get("esic_number") or "N/A"), cell_regular)
        ],
        [
            Paragraph("<b>Bank Name:</b>", cell_bold), Paragraph(str(employee.get("bank_name", "")), cell_regular),
            Paragraph("<b>Account No:</b>", cell_bold), Paragraph(str(employee.get("account_number", "")), cell_regular)
        ],
        [
            Paragraph("<b>IFSC Code:</b>", cell_bold), Paragraph(str(employee.get("ifsc_code", "")), cell_regular),
            Paragraph("<b>Days Payable / Total:</b>", cell_bold), Paragraph(f"{payslip.get('payable_days', 0)} / {payslip.get('total_working_days', 0)} days", cell_regular)
        ],
    ]

    emp_table = Table(emp_details, colWidths=[105, 156, 105, 156])
    emp_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(emp_table)
    story.append(Spacer(1, 10))

    # 3. Salary Breakdown Table (Earnings vs Deductions)
    salary_data = [
        [
            Paragraph("<b>EARNINGS</b>", cell_bold), Paragraph("<b>AMOUNT (Rs.)</b>", cell_right_bold),
            Paragraph("<b>DEDUCTIONS</b>", cell_bold), Paragraph("<b>AMOUNT (Rs.)</b>", cell_right_bold)
        ],
        [
            Paragraph("Basic Salary", cell_regular), Paragraph(f"{payslip.get('earned_basic', 0.0):,.2f}", cell_right),
            Paragraph("Provident Fund (EPF)", cell_regular), Paragraph(f"{payslip.get('ded_pf', 0.0):,.2f}", cell_right)
        ],
        [
            Paragraph("House Rent Allowance (HRA)", cell_regular), Paragraph(f"{payslip.get('earned_hra', 0.0):,.2f}", cell_right),
            Paragraph("Employee State Ins. (ESIC)", cell_regular), Paragraph(f"{payslip.get('ded_esi', 0.0):,.2f}", cell_right)
        ],
        [
            Paragraph("Conveyance Allowance", cell_regular), Paragraph(f"{payslip.get('earned_conveyance', 0.0):,.2f}", cell_right),
            Paragraph("Professional Tax (PT)", cell_regular), Paragraph(f"{payslip.get('ded_pt', 0.0):,.2f}", cell_right)
        ],
        [
            Paragraph("Special Allowance", cell_regular), Paragraph(f"{payslip.get('earned_special', 0.0):,.2f}", cell_right),
            Paragraph("TDS / Income Tax", cell_regular), Paragraph(f"{payslip.get('ded_tds', 0.0):,.2f}", cell_right)
        ],
        [
            Paragraph("Medical Allowance", cell_regular), Paragraph(f"{payslip.get('earned_medical', 0.0):,.2f}", cell_right),
            Paragraph("Salary Advance / Loan", cell_regular), Paragraph(f"{payslip.get('ded_advance', 0.0):,.2f}", cell_right)
        ],
        [
            Paragraph("Overtime Pay", cell_regular), Paragraph(f"{payslip.get('earned_overtime', 0.0):,.2f}", cell_right),
            Paragraph("-", cell_regular), Paragraph("-", cell_right)
        ],
        [
            Paragraph("Performance Bonus / Incentives", cell_regular), Paragraph(f"{payslip.get('earned_bonus', 0.0):,.2f}", cell_right),
            Paragraph("-", cell_regular), Paragraph("-", cell_right)
        ],
        [
            Paragraph("<b>GROSS EARNINGS</b>", cell_bold), Paragraph(f"<b>Rs. {payslip.get('earned_gross', 0.0):,.2f}</b>", cell_right_bold),
            Paragraph("<b>TOTAL DEDUCTIONS</b>", cell_bold), Paragraph(f"<b>Rs. {payslip.get('total_deductions', 0.0):,.2f}</b>", cell_right_bold)
        ]
    ]

    salary_table = Table(salary_data, colWidths=[180, 81, 180, 81])
    salary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F8FAFC')),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#F1F5F9')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(salary_table)
    story.append(Spacer(1, 10))

    # 4. Net Salary Box
    net_val = payslip.get('net_pay', 0.0)
    words_str = number_to_words_inr(net_val)
    
    net_box = [
        [
            Paragraph("<b>NET TAKE-HOME SALARY:</b>", cell_bold),
            Paragraph(f"<font size=12 color='#0284C7'><b>Rs. {net_val:,.2f}</b></font>", cell_right_bold)
        ],
        [
            Paragraph("<b>Amount in Words:</b>", cell_bold),
            Paragraph(f"<i>{words_str}</i>", cell_regular)
        ]
    ]
    net_table = Table(net_box, colWidths=[150, 372])
    net_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F0F9FF')),
        ('BOX', (0, 0), (-1, -1), 1.5, colors.HexColor('#38BDF8')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#BAE6FD')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(net_table)
    story.append(Spacer(1, 10))

    # 5. Employer Contribution Memo (For Audit & Transparency)
    er_pf = payslip.get('employer_pf', 0.0)
    er_esi = payslip.get('employer_esi', 0.0)
    er_tot = payslip.get('employer_cost', 0.0)
    memo_text = f"<b>Employer Benefits Memo:</b> Employer EPF Contribution: Rs. {er_pf:,.2f} | Employer ESIC Contribution: Rs. {er_esi:,.2f} | Total Monthly Company CTC: Rs. {er_tot:,.2f}"
    story.append(Paragraph(memo_text, sub_title_style))
    story.append(Spacer(1, 30))

    # 6. Signatures Footer
    signatures = [
        [
            Paragraph("____________________________<br/><b>Employee Signature</b>", cell_regular),
            Paragraph(f"____________________________<br/><b>{company.get('signatory_name', 'Authorized Signatory')}</b><br/>{company.get('company_name', '')}", cell_right)
        ]
    ]
    sig_table = Table(signatures, colWidths=[261, 261])
    sig_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
    ]))
    story.append(sig_table)
    story.append(Spacer(1, 15))
    story.append(Paragraph("<i>This is a computer-generated document issued by MSME Payroll System.</i>", sub_title_style))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
