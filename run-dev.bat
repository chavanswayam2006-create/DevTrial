@echo off
echo =====================================================================
echo  DevTrail AI - Intelligent Web Development Learning Navigator
echo  Starting FastAPI Backend and Vite React Frontend Dev Servers
echo =====================================================================

start "DevTrail Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 2 /nobreak >nul

start "DevTrail Frontend (Vite React)" cmd /k "cd frontend && npm run dev -- --host 127.0.0.1 --port 5173"
timeout /t 2 /nobreak >nul

echo.
echo DevTrail AI is launching!
echo Backend API:  http://127.0.0.1:8000 (Docs: http://127.0.0.1:8000/docs)
echo Frontend UI:  http://127.0.0.1:5173/
echo.
pause
