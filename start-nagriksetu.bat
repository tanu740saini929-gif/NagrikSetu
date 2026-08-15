@echo off
title NagrikSetu Launcher
color 0B

echo.
echo ==========================================
echo              NAGRIKSETU
echo ==========================================
echo.

echo [1/3] Starting Backend...
start "NagrikSetu Backend" cmd /k "cd /d C:\Users\tanu7\Desktop\Nagriksetu\backend && python -m uvicorn app.main:app --reload"

timeout /t 4 /nobreak >nul

echo [2/3] Starting Frontend...
start "NagrikSetu Frontend" cmd /k "cd /d C:\Users\tanu7\Desktop\Nagriksetu\frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo [3/3] Opening NagrikSetu...
start "" "http://localhost:5173/"

echo.
echo ==========================================
echo        NAGRIKSETU STARTED
echo ==========================================
echo.
echo Website:
echo http://localhost:5173/
echo.
echo Backend:
echo http://127.0.0.1:8000/
echo.
echo API Docs:
echo http://127.0.0.1:8000/docs
echo.
echo ==========================================

exit