import sqlite3
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "payroll.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Company Profile
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS company_profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        company_name TEXT NOT NULL DEFAULT 'Acme Technologies Pvt Ltd (MSME)',
        udyam_reg_no TEXT DEFAULT 'UDYAM-MH-01-0012345',
        pan_no TEXT DEFAULT 'AABCU9876K',
        tan_no TEXT DEFAULT 'MUMU12345B',
        gstin TEXT DEFAULT '27AABCU9876K1Z5',
        address TEXT DEFAULT '101, Business Pinnacle Park, Sector 4, Mumbai, Maharashtra 400051',
        phone TEXT DEFAULT '+91 98765 43210',
        email TEXT DEFAULT 'hr@acmetechmsme.com',
        pf_code TEXT DEFAULT 'MH/BAN/0012345/000',
        esic_code TEXT DEFAULT '31000123450000101',
        pt_state TEXT DEFAULT 'Maharashtra',
        pt_default_amount REAL DEFAULT 200.0,
        signatory_name TEXT DEFAULT 'Director / Authorized Signatory'
    );
    """)

    # 2. Departments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    );
    """)

    # 3. Designations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS designations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT UNIQUE NOT NULL
    );
    """)

    # 4. Employees Master
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        department TEXT NOT NULL,
        designation TEXT NOT NULL,
        date_of_joining TEXT NOT NULL,
        status TEXT DEFAULT 'ACTIVE',
        
        -- Bank details
        bank_name TEXT NOT NULL,
        account_number TEXT NOT NULL,
        ifsc_code TEXT NOT NULL,
        
        -- Statutory / KYC
        pan_number TEXT NOT NULL,
        aadhaar_number TEXT,
        uan_number TEXT,
        esic_number TEXT,
        pf_opted INTEGER DEFAULT 1,
        esic_opted INTEGER DEFAULT 1,
        tax_regime TEXT DEFAULT 'NEW',
        
        -- Monthly Salary Components (Standard Structure)
        basic_salary REAL NOT NULL DEFAULT 0,
        hra REAL NOT NULL DEFAULT 0,
        conveyance_allowance REAL DEFAULT 0,
        special_allowance REAL DEFAULT 0,
        medical_allowance REAL DEFAULT 0,
        fixed_gross REAL NOT NULL DEFAULT 0,
        monthly_pt REAL DEFAULT 200.0,
        monthly_tds REAL DEFAULT 0.0
    );
    """)

    # 5. Monthly Attendance & Adjustments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS monthly_attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT NOT NULL,
        month_str TEXT NOT NULL,
        total_working_days INTEGER DEFAULT 26,
        days_present REAL DEFAULT 26,
        paid_leaves REAL DEFAULT 0,
        lop_days REAL DEFAULT 0,
        overtime_hours REAL DEFAULT 0,
        overtime_rate REAL DEFAULT 0,
        bonus_incentive REAL DEFAULT 0,
        advance_deduction REAL DEFAULT 0,
        tds_deduction REAL DEFAULT 0,
        remarks TEXT,
        UNIQUE(employee_id, month_str),
        FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE
    );
    """)

    # 6. Payroll Runs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payroll_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month_str TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'DRAFT',
        processed_at TEXT,
        locked_at TEXT,
        total_gross REAL DEFAULT 0,
        total_deductions REAL DEFAULT 0,
        total_net_pay REAL DEFAULT 0,
        total_employer_pf REAL DEFAULT 0,
        total_employer_esi REAL DEFAULT 0,
        total_ctc REAL DEFAULT 0,
        employee_count INTEGER DEFAULT 0
    );
    """)

    # 7. Payslips
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payslips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payroll_run_id INTEGER,
        employee_id TEXT NOT NULL,
        month_str TEXT NOT NULL,
        
        -- Attendance Stats
        total_working_days INTEGER,
        payable_days REAL,
        lop_days REAL,
        
        -- Earned Earnings
        earned_basic REAL DEFAULT 0,
        earned_hra REAL DEFAULT 0,
        earned_conveyance REAL DEFAULT 0,
        earned_special REAL DEFAULT 0,
        earned_medical REAL DEFAULT 0,
        earned_overtime REAL DEFAULT 0,
        earned_bonus REAL DEFAULT 0,
        earned_gross REAL DEFAULT 0,
        
        -- Deductions
        ded_pf REAL DEFAULT 0,
        ded_esi REAL DEFAULT 0,
        ded_pt REAL DEFAULT 0,
        ded_tds REAL DEFAULT 0,
        ded_advance REAL DEFAULT 0,
        total_deductions REAL DEFAULT 0,
        
        -- Net Take Home
        net_pay REAL DEFAULT 0,
        
        -- Employer Cost Components
        employer_pf REAL DEFAULT 0,
        employer_esi REAL DEFAULT 0,
        employer_cost REAL DEFAULT 0,
        
        status TEXT DEFAULT 'COMPUTED',
        created_at TEXT,
        FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE,
        FOREIGN KEY(payroll_run_id) REFERENCES payroll_runs(id) ON DELETE CASCADE
    );
    """)

    # Insert default company if not present
    cursor.execute("SELECT id FROM company_profile WHERE id = 1")
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO company_profile (id, company_name, udyam_reg_no, pan_no, tan_no, gstin, address, phone, email, pf_code, esic_code, pt_state, pt_default_amount)
        VALUES (1, 'Apex MSME Technologies Pvt Ltd', 'UDYAM-MH-01-0078901', 'AABCA1234F', 'MUMA99887C', '27AABCA1234F1Z9', 'Unit 402, Innovate IT Park, Andheri East, Mumbai 400069', '+91 98200 12345', 'admin@apextech.in', 'MH/BAN/0045678/000', '31000456780000101', 'Maharashtra', 200.0)
        """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at:", DB_PATH)
