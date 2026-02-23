@echo off
REM Quick Start Script for Metric Alerting Platform

echo.
echo ========================================
echo  Real-Time Metric Alerting Platform
echo  Quick Start Script
echo ========================================
echo.

REM Check Node.js installation
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking Node.js version...
node --version
echo.

echo [1/4] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed
echo.

echo [2/4] Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed
echo.

echo [3/4] Starting backend server (port 5000)...
start "Backend" cmd /k "cd backend && npm start"
echo ✓ Backend starting in new window
echo.

echo [4/4] Starting frontend dev server (port 3000)...
timeout /t 2
start "Frontend" cmd /k "cd frontend && npm run dev"
echo ✓ Frontend starting in new window
echo.

echo ========================================
echo  ✓ Application Started!
echo ========================================
echo.
echo  Frontend:  http://localhost:3000
echo  Backend:   http://localhost:5000
echo  API Docs:  See README.md
echo.
echo Open http://localhost:3000 in your browser
echo.
pause
