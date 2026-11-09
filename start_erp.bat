@echo off
title Mastered Skill Academy ERP - Calicut
cd /d "%~dp0"
set "PATH=%PATH%;C:\Users\Admin\nodejs"
echo =====================================================================
echo   MASTERED SKILL ACADEMY ERP - CALICUT CAMPUS
echo   Starting application server at: http://localhost:3000
echo =====================================================================
echo.
echo Opening browser...
start http://localhost:3000
npm run dev
