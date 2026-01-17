@echo off
echo ========================================
echo   NFC Medical Platform - Stop Services
echo ========================================
echo.

cd /d "%~dp0"

echo Stopping all Docker services...
docker-compose down

if errorlevel 1 (
    echo [ERROR] Failed to stop services
    pause
    exit /b 1
)

echo.
echo ========================================
echo   All Services Stopped
echo ========================================
echo.
echo Note: Frontend dev server may still be running.
echo Check running processes if needed.
echo.
pause
