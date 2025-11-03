@echo off
echo ==========================================
echo Starting Contact Pipeline
echo ==========================================
echo.

echo Checking MongoDB status...
net start | find "MongoDB" >nul
if %errorlevel% equ 0 (
    echo MongoDB is running
) else (
    echo Starting MongoDB...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo.
        echo WARNING: MongoDB is not running!
        echo Please start MongoDB manually:
        echo   Run "mongod" in a separate terminal
        echo   Or run "net start MongoDB" as Administrator
        echo.
        pause
        exit
    )
)

echo.
echo Starting Backend and Frontend...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop both services
echo.

npm run dev
