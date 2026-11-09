import os
import sqlite3
from app.database import get_db, init_db

def seed_msme_data():
    init_db()
    conn = get_db()
    cursor = conn.cursor()

    # Clear existing demo employees if any to avoid duplication
    cursor.execute("SELECT COUNT(*) as cnt FROM employees")
    if cursor.fetchone()["cnt"] > 0:
        print("Employees already seeded. Skipping.")
        conn.close()
        return

    # Seed Departments
    depts = ["Management", "Engineering", "Sales & Marketing", "Human Resources", "Finance & Accounts", "Operations & Support"]
    for d in depts:
        cursor.execute("INSERT OR IGNORE INTO departments (name) VALUES (?)", (d,))

    # Seed Designations
    desigs = [
        "Director - Operations", "Lead Software Engineer", "Senior Sales Manager",
        "HR & Admin Executive", "Accountant", "QA Engineer", "Customer Support Lead",
        "Field Sales Executive", "Office Administrator", "Logistics Executive"
    ]
    for ds in desigs:
        cursor.execute("INSERT OR IGNORE INTO designations (title) VALUES (?)", (ds,))

    # 10 MSME Employees Dataset
    employees = [
        {
            "id": "EMP001",
            "full_name": "Rajesh Sharma",
            "email": "rajesh.sharma@apextech.in",
            "phone": "+91 98201 11221",
            "department": "Management",
            "designation": "Director - Operations",
            "date_of_joining": "2021-04-01",
            "bank_name": "HDFC Bank",
            "account_number": "50100234567890",
            "ifsc_code": "HDFC0000240",
            "pan_number": "ABFPS1234D",
            "aadhaar_number": "4521 8890 1234",
            "uan_number": "100908765431",
            "esic_number": "",
            "pf_opted": 1,
            "esic_opted": 0,
            "tax_regime": "NEW",
            "basic_salary": 42500.0,
            "hra": 21250.0,
            "conveyance_allowance": 4000.0,
            "special_allowance": 14250.0,
            "medical_allowance": 3000.0,
            "fixed_gross": 85000.0,
            "monthly_pt": 200.0,
            "monthly_tds": 3500.0
        },
        {
            "id": "EMP002",
            "full_name": "Priya Nair",
            "email": "priya.nair@apextech.in",
            "phone": "+91 98202 22332",
            "department": "Engineering",
            "designation": "Lead Software Engineer",
            "date_of_joining": "2022-02-15",
            "bank_name": "ICICI Bank",
            "account_number": "123405009876",
            "ifsc_code": "ICIC0000104",
            "pan_number": "BKTPN4567M",
            "aadhaar_number": "6712 3456 7890",
            "uan_number": "100908765432",
            "esic_number": "",
            "pf_opted": 1,
            "esic_opted": 0,
            "tax_regime": "NEW",
            "basic_salary": 32500.0,
            "hra": 16250.0,
            "conveyance_allowance": 3250.0,
            "special_allowance": 11000.0,
            "medical_allowance": 2000.0,
            "fixed_gross": 65000.0,
            "monthly_pt": 200.0,
            "monthly_tds": 1800.0
        },
        {
            "id": "EMP003",
            "full_name": "Amit Verma",
            "email": "amit.verma@apextech.in",
            "phone": "+91 98203 33443",
            "department": "Sales & Marketing",
            "designation": "Senior Sales Manager",
            "date_of_joining": "2022-07-01",
            "bank_name": "State Bank of India",
            "account_number": "30987654321",
            "ifsc_code": "SBIN0000300",
            "pan_number": "CLPAV7890P",
            "aadhaar_number": "8923 4567 1234",
            "uan_number": "100908765433",
            "esic_number": "",
            "pf_opted": 1,
            "esic_opted": 0,
            "tax_regime": "NEW",
            "basic_salary": 22500.0,
            "hra": 11250.0,
            "conveyance_allowance": 2500.0,
            "special_allowance": 7250.0,
            "medical_allowance": 1500.0,
            "fixed_gross": 45000.0,
            "monthly_pt": 200.0,
            "monthly_tds": 500.0
        },
        {
            "id": "EMP004",
            "full_name": "Neha Gupta",
            "email": "neha.gupta@apextech.in",
            "phone": "+91 98204 44554",
            "department": "Human Resources",
            "designation": "HR & Admin Executive",
            "date_of_joining": "2023-01-10",
            "bank_name": "HDFC Bank",
            "account_number": "50100987654321",
            "ifsc_code": "HDFC0000240",
            "pan_number": "DFFNG3456Q",
            "aadhaar_number": "3412 5678 9012",
            "uan_number": "100908765434",
            "esic_number": "",
            "pf_opted": 1,
            "esic_opted": 0,
            "tax_regime": "NEW",
            "basic_salary": 16000.0,
            "hra": 8000.0,
            "conveyance_allowance": 2000.0,
            "special_allowance": 5000.0,
            "medical_allowance": 1000.0,
            "fixed_gross": 32000.0,
            "monthly_pt": 200.0,
            "monthly_tds": 0.0
        },
        {
            "id": "EMP005",
            "full_name": "Vikram Singh",
            "email": "vikram.singh@apextech.in",
            "phone": "+91 98205 55665",
            "department": "Finance & Accounts",
            "designation": "Accountant",
            "date_of_joining": "2023-05-18",
            "bank_name": "Axis Bank",
            "account_number": "912010012345678",
            "ifsc_code": "UTIB0000040",
            "pan_number": "EHJVS9012K",
            "aadhaar_number": "9012 3456 7890",
            "uan_number": "100908765435",
            "esic_number": "",
            "pf_opted": 1,
            "esic_opted": 0,
            "tax_regime": "NEW",
            "basic_salary": 14000.0,
            "hra": 7000.0,
            "conveyance_allowance": 2000.0,
            "special_allowance": 4000.0,
            "medical_allowance": 1000.0,
            "fixed_gross": 28000.0,
            "monthly_pt": 200.0,
            "monthly_tds": 0.0
        },
        {
            "id": "EMP006",
            "full_name": "Suresh Patel",
            "email": "suresh.patel@apextech.in",
            "phone": "+91 98206 66776",
            "department": "Engineering",
            "designation": "QA Engineer",
            "date_of_joining": "2023-08-01",
            "bank_name": "ICICI Bank",
            "account_number": "123405001122",
            "ifsc_code": "ICIC0000104",
            "pan_number": "FJTSP5678L",
            "aadhaar_number": "2345 6789 0123",
            "uan_number": "100908765436",
            "esic_number": "",
            "pf_opted": 1,
            "esic_opted": 0,
            "tax_regime": "NEW",
            "basic_salary": 12500.0,
            "hra": 6250.0,
            "conveyance_allowance": 1600.0,
            "special_allowance": 3650.0,
            "medical_allowance": 1000.0,
            "fixed_gross": 25000.0,
            "monthly_pt": 200.0,
            "monthly_tds": 0.0
        },
        {
            "id": "EMP007",
            "full_name": "Sneha Kulkarni",
            "email": "sneha.kulkarni@apextech.in",
            "phone": "+91 98207 77887",
            "department": "Operations & Support",
            "designation": "Customer Support Lead",
            "date_of_joining": "2023-11-15",
            "bank_name": "Kotak Mahindra Bank",
            "account_number": "6512345678",
            "ifsc_code": "KKBK0000958",
            "pan_number": "GKLPS2345T",
            "aadhaar_number": "7890 1234 5678",
            "uan_number": "100908765437",
            "esic_number": "",
            "pf_opted": 1,
            "esic_opted": 0,
            "tax_regime": "NEW",
            "basic_salary": 11000.0,
            "hra": 5500.0,
            "conveyance_allowance": 1500.0,
            "special_allowance": 3000.0,
            "medical_allowance": 1000.0,
            "fixed_gross": 22000.0,
            "monthly_pt": 200.0,
            "monthly_tds": 0.0
        },
        {
            "id": "EMP008",
            "full_name": "Manoj Yadav",
            "email": "manoj.yadav@apextech.in",
            "phone": "+91 98208 88998",
            "department": "Sales & Marketing",
            "designation": "Field Sales Executive",
            "date_of_joining": "2024-02-01",
            "bank_name": "State Bank of India",
            "account_number": "31987654322",
            "ifsc_code": "SBIN0000300",
            "pan_number": "HMEMY6789W",
            "aadhaar_number": "1234 5678 9012",
            "uan_number": "100908765438",
            "esic_number": "312345678901",
            "pf_opted": 1,
            "esic_opted": 1, # Gross <= 21,000 -> ESIC applicable
            "tax_regime": "NEW",
            "basic_salary": 9750.0,
            "hra": 4875.0,
            "conveyance_allowance": 1500.0,
            "special_allowance": 2375.0,
            "medical_allowance": 1000.0,
            "fixed_gross": 19500.0,
            "monthly_pt": 200.0,
            "monthly_tds": 0.0
        },
        {
            "id": "EMP009",
            "full_name": "Kavita Devi",
            "email": "kavita.devi@apextech.in",
            "phone": "+91 98209 99009",
            "department": "Human Resources",
            "designation": "Office Administrator",
            "date_of_joining": "2024-04-10",
            "bank_name": "Bank of Baroda",
            "account_number": "01230100012345",
            "ifsc_code": "BARB0ANDHER",
            "pan_number": "IPQKD0123E",
            "aadhaar_number": "5678 9012 3456",
            "uan_number": "100908765439",
            "esic_number": "312345678902",
            "pf_opted": 1,
            "esic_opted": 1, # Gross <= 21,000 -> ESIC applicable
            "tax_regime": "NEW",
            "basic_salary": 8500.0,
            "hra": 4250.0,
            "conveyance_allowance": 1250.0,
            "special_allowance": 2000.0,
            "medical_allowance": 1000.0,
            "fixed_gross": 17000.0,
            "monthly_pt": 200.0,
            "monthly_tds": 0.0
        },
        {
            "id": "EMP010",
            "full_name": "Ramesh Kumar",
            "email": "ramesh.kumar@apextech.in",
            "phone": "+91 98210 10101",
            "department": "Operations & Support",
            "designation": "Logistics Executive",
            "date_of_joining": "2024-06-01",
            "bank_name": "Punjab National Bank",
            "account_number": "0024000100123456",
            "ifsc_code": "PUNB0002400",
            "pan_number": "JRFRK4567R",
            "aadhaar_number": "8901 2345 6789",
            "uan_number": "100908765440",
            "esic_number": "312345678903",
            "pf_opted": 1,
            "esic_opted": 1, # Gross <= 21,000 -> ESIC applicable
            "tax_regime": "NEW",
            "basic_salary": 7500.0,
            "hra": 3750.0,
            "conveyance_allowance": 1250.0,
            "special_allowance": 1500.0,
            "medical_allowance": 1000.0,
            "fixed_gross": 15000.0,
            "monthly_pt": 175.0, # Under slab for ₹15,000
            "monthly_tds": 0.0
        }
    ]

    for emp in employees:
        cursor.execute("""
        INSERT INTO employees (
            id, full_name, email, phone, department, designation, date_of_joining,
            bank_name, account_number, ifsc_code, pan_number, aadhaar_number,
            uan_number, esic_number, pf_opted, esic_opted, tax_regime,
            basic_salary, hra, conveyance_allowance, special_allowance,
            medical_allowance, fixed_gross, monthly_pt, monthly_tds
        ) VALUES (
            :id, :full_name, :email, :phone, :department, :designation, :date_of_joining,
            :bank_name, :account_number, :ifsc_code, :pan_number, :aadhaar_number,
            :uan_number, :esic_number, :pf_opted, :esic_opted, :tax_regime,
            :basic_salary, :hra, :conveyance_allowance, :special_allowance,
            :medical_allowance, :fixed_gross, :monthly_pt, :monthly_tds
        )
        """, emp)

    # Pre-seed initial Attendance for October 2026 (Month of current system date)
    month_str = "2026-10"
    for idx, emp in enumerate(employees):
        # Introduce slight realistic variations for 2 employees (e.g. 1 LOP day, 1 with sales bonus)
        lop = 1.0 if emp["id"] == "EMP003" else 0.0
        bonus = 3000.0 if emp["id"] == "EMP003" else 0.0
        ot_hours = 8.0 if emp["id"] == "EMP010" else 0.0
        ot_rate = 120.0 if emp["id"] == "EMP010" else 0.0

        cursor.execute("""
        INSERT OR IGNORE INTO monthly_attendance (
            employee_id, month_str, total_working_days, days_present, paid_leaves,
            lop_days, overtime_hours, overtime_rate, bonus_incentive, advance_deduction,
            tds_deduction, remarks
        ) VALUES (?, ?, 26, ?, 0, ?, ?, ?, ?, 0, ?, ?)
        """, (
            emp["id"], month_str, 26 - lop, lop, ot_hours, ot_rate, bonus,
            emp["monthly_tds"], "Regular cycle"
        ))

    conn.commit()
    conn.close()
    print("Successfully seeded 10 MSME employee profiles and attendance data for 2026-10!")

if __name__ == "__main__":
    seed_msme_data()
