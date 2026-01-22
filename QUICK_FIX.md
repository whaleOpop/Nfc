# Быстрое исправление фронтенда

## Проблема
Фронтенд делает запросы на неправильный URL: `https://test.soldium.ru/testapi.soldium.ru/api/...`

## Решение в 4 шага

### 1. Коммит и пуш (локально)
```bash
git add .
git commit -m "Fix frontend API URL configuration"
git push
```

### 2. На сервере - обновить код
```bash
ssh root@46.173.18.72
cd /root/nfc
git pull
```

### 3. Обновить .env файл на сервере
```bash
nano .env
```

Добавить/изменить эти строки:
```env
# Backend
ALLOWED_HOSTS=localhost,127.0.0.1,46.173.18.72,testapi.soldium.ru,test.soldium.ru,soldium.ru

# Frontend (в конце файла)
VITE_API_URL=https://testapi.soldium.ru/api
VITE_APP_NAME=NFC Medical Platform
VITE_ENVIRONMENT=production
NODE_ENV=production
```

Сохранить: Ctrl+O, Enter, Ctrl+X

### 4. Пересобрать фронтенд и перезапустить все
```bash
docker-compose stop web
docker-compose build --no-cache web
docker-compose up -d web
docker-compose restart backend celery celery-beat
```

## Проверка
```bash
# Логи фронтенда
docker-compose logs -f web

# Логи бэкенда
docker-compose logs -f backend
```

Открыть в браузере: https://test.soldium.ru/register

Запросы должны идти на: `https://testapi.soldium.ru/api/auth/register/`

---

Подробная инструкция: [DEPLOY_FRONTEND_FIX.md](DEPLOY_FRONTEND_FIX.md)
