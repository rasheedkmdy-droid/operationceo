# PayMaster - MSME Payroll Management System (10 Employees)

A production-ready, lightweight, and audit-compliant **Payroll Management System** engineered specifically for Indian Micro, Small, and Medium Enterprises (MSMEs).

---

## 🌟 Key Functional Areas Covered

### 1. Master Data Management
- **Company Master**: Registered Entity details, Udyam MSME Registration Number, PAN, TAN, GSTIN, PF Establishment Code, ESIC Code, Professional Tax (PT) State, and Authorized Payslip Signatory.
- **Employee Master**: 10 pre-loaded employee profiles covering key enterprise departments (Management, Tech, Sales, HR, Accounts, Operations, Support). Complete with KYC (PAN, Aadhaar), Bank Details (A/C No, IFSC), and UAN / ESIC numbers.
- **Salary Structure Master**: Configurable CTC breakup (Basic Salary, HRA, Conveyance, Special Allowance, Medical) with an automated 50% Basic structure calculator and statutory limit toggles.

### 2. Operational Modules & Monthly Workflow
- **Attendance & Variable Adjustments**: Monthly grid for capturing total working days, present days, Loss of Pay (LOP) unpaid leaves, overtime hours & rates, sales bonuses/incentives, and loan/advance deductions.
- **Statutory Compliance Engine**:
  - **EPF (Employees' Provident Fund)**: 12% on Basic Pay (with standard statutory ceiling rule of ₹15,000 / ₹1,800 cap). Matching 12% Employer PF.
  - **ESIC (State Insurance)**: Automated threshold checking — 0.75% Employee share and 3.25% Employer share for employees with gross monthly wages $\le$ ₹21,000. Exempt for salaries above ₹21,000.
  - **Professional Tax (PT)**: State-specific deduction (e.g. ₹200/month in Maharashtra).
  - **TDS / Section 192**: Monthly tax withholding deductions.
- **Monthly Run & Locking**: One-click computation, draft inspection, and cycle lock to ensure data integrity.

### 3. Deliverables & Audit Exports
- **Branded PDF Payslips**: Itemized payslips with earnings, deductions, net salary in words, and authorized signatory.
- **Corporate Bank Disbursement Sheet (.xlsx)**: Excel sheet formatted for bulk salary upload into HDFC, ICICI, SBI, and Axis Net Banking portals.
- **Monthly Wage Register (Form T .xlsx)**: Comprehensive master ledger for accounting records and Labor Law audit compliance.

---

## 🚀 Quick Start Instructions

### Starting the Application:
Simply run:
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Or double-click `run.bat` on Windows.

Open your browser at:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 📁 System Architecture

```
c:\Users\Admin\Desktop\crm\
├── app/
│   ├── main.py                  # FastAPI web server and routing
│   ├── database.py              # SQLite connection & schema initialization
│   ├── engine/
│   │   └── payroll_calculator.py# Statutory computation & pro-rata engine
│   ├── reports/
│   │   ├── payslip_pdf.py       # ReportLab PDF payslip generator
│   │   ├── bank_export.py       # OpenPyXL corporate bank payout exporter
│   │   └── wage_register.py     # OpenPyXL Form T wage register builder
│   ├── templates/               # Jinja2 enterprise HTML templates
│   │   ├── base.html            # Main navigation and top bar layout
│   │   ├── dashboard.html       # Analytics & summary metrics
│   │   ├── employees.html       # Employee master directory & modal
│   │   ├── attendance.html      # Monthly attendance & adjustments grid
│   │   ├── payroll_run.html     # Payroll processing & approval sheet
│   │   ├── reports.html         # Compliance reports & download hub
│   │   └── company.html         # Company & MSME settings
│   └── static/
│       ├── css/style.css        # Custom styles & print utilities
│       └── js/app.js            # Frontend JavaScript handlers
├── seed_data.py                 # Seeds 10 realistic MSME employee records
├── test_system.py               # Automated verification test suite
├── requirements.txt             # Installed dependencies
├── run.bat                      # Windows one-click launcher
└── README.md                    # System documentation
```
