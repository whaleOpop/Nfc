@echo off
REM Generate Django migrations using Docker with volume mount

echo Creating Django migrations...

REM Create temporary .env for makemigrations
echo SECRET_KEY=temporary-key-for-makemigrations > .env.temp
echo DEBUG=True >> .env.temp
echo DB_HOST=db >> .env.temp
echo DB_PORT=5432 >> .env.temp
echo POSTGRES_DB=nfc_medical >> .env.temp
echo POSTGRES_USER=nfc_user >> .env.temp
echo POSTGRES_PASSWORD=temp >> .env.temp
echo ALLOWED_HOSTS=* >> .env.temp

REM Run makemigrations with volume mount
docker compose -f docker-compose.dev.yml run --rm --no-deps --env-file .env.temp backend python manage.py makemigrations

REM Cleanup
del .env.temp

echo.
echo Done! Migrations created in backend/apps/*/migrations/
echo.
echo Next steps:
echo   git add backend/apps/*/migrations/
echo   git commit -m "Add Django migrations"
echo   git push origin main
pause
