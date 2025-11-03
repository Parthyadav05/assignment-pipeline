@echo off
echo ==========================================
echo Contact Pipeline Setup Script
echo ==========================================
echo.

echo [1/5] Checking MongoDB...
net start | find "MongoDB" >nul
if %errorlevel% equ 0 (
    echo MongoDB is already running
) else (
    echo Starting MongoDB service...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo.
        echo WARNING: Could not start MongoDB service automatically.
        echo Please start MongoDB manually:
        echo   Option 1: Run "mongod" in a separate terminal
        echo   Option 2: Run "net start MongoDB" as Administrator
        echo.
        pause
    )
)

echo.
echo [2/5] Creating environment files...
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo Created backend\.env
) else (
    echo backend\.env already exists
)

if not exist frontend\.env.local (
    copy frontend\.env.local.example frontend\.env.local
    echo Created frontend\.env.local
) else (
    echo frontend\.env.local already exists
)

echo.
echo [3/5] Installing root dependencies...
call npm install

echo.
echo [4/5] Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo [5/5] Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo To start the application, run:
echo   npm run dev
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
pause
