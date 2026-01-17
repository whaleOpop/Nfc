@echo off
echo ========================================
echo   NFC Medical Platform - Local Start
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Docker...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop is not running!
    echo Please start Docker Desktop and try again.
    echo.
    echo Alternatively, check LOCAL_DEVELOPMENT.md for manual setup.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

echo Starting backend services (db, redis, backend)...
docker-compose up -d db redis backend

if errorlevel 1 (
    echo [ERROR] Failed to start backend services
    pause
    exit /b 1
)

echo Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo Checking backend status...
docker-compose ps

echo.
echo Running migrations...
docker-compose exec -T backend python manage.py migrate

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo   (Already running in background)
echo.
echo Backend API: http://localhost:8000
echo Backend Admin: http://localhost:8000/admin
echo API Docs: http://localhost:8000/api/docs
echo.
echo ========================================
echo.
echo To create superuser, run:
echo   docker-compose exec backend python manage.py createsuperuser
echo.
echo To view backend logs:
echo   docker-compose logs -f backend
echo.
echo To stop all services:
echo   docker-compose down
echo.
pause
