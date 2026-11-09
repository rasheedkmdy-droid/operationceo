@echo off
title PayMaster - MSME Payroll System
echo ====================================================
echo      PayMaster - MSME Payroll Management System
echo ====================================================
echo Starting server at http://127.0.0.1:8000 ...
echo Press Ctrl+C to stop.
echo.

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
