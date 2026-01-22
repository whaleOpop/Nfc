# Инструкция по исправлению проблем фронтенда

## Проблемы которые решаем

1. ❌ Неправильный URL запросов: `https://test.soldium.ru/testapi.soldium.ru/api/...`
2. ❌ ALLOWED_HOSTS ошибка: `soldium.ru` не в списке

## Что изменено

### Локально (уже сделано)
- ✅ `web/.env` - изменен `VITE_API_URL` на `https://testapi.soldium.ru/api`
- ✅ `web/.env.example` - обновлен с `/api` на конце
- ✅ Создан скрипт `update-allowed-hosts.sh` для обновления бэкенда

## Шаги деплоя на сервер

### 1. Закоммитить изменения
```bash
git add web/.env web/.env.example update-allowed-hosts.sh
git commit -m "Fix frontend API URL and update ALLOWED_HOSTS script"
git push
```

### 2. На сервере - обновить код
```bash
ssh root@46.173.18.72
cd /root/nfc
git pull
```

### 3. Обновить ALLOWED_HOSTS бэкенда
```bash
# Запустить скрипт
chmod +x update-allowed-hosts.sh
./update-allowed-hosts.sh
```

Или вручную отредактировать `.env`:
```bash
nano .env
```

Найти строку `ALLOWED_HOSTS` и изменить на:
```
ALLOWED_HOSTS=localhost,127.0.0.1,46.173.18.72,testapi.soldium.ru,test.soldium.ru,soldium.ru
```

Сохранить (Ctrl+O, Enter, Ctrl+X).

### 4. Обновить VITE переменные в корневом .env
```bash
nano .env
```

Найти или добавить строки (в конец файла):
```
# Frontend Configuration
VITE_API_URL=https://testapi.soldium.ru/api
VITE_APP_NAME=NFC Medical Platform
VITE_ENVIRONMENT=production
NODE_ENV=production
```

⚠️ **ВАЖНО**: URL должен заканчиваться на `/api` потому что в коде endpoints начинаются с `/auth/`, `/profiles/` и т.д.

Сохранить (Ctrl+O, Enter, Ctrl+X).

### 5. Пересобрать и перезапустить фронтенд
```bash
# Остановить фронтенд
docker-compose stop web

# Пересобрать образ (важно для обновления .env переменных)
docker-compose build --no-cache web

# Запустить
docker-compose up -d web
```

### 6. Перезапустить бэкенд контейнеры
```bash
docker-compose restart backend celery celery-beat
```

### 7. Проверить что все работает
```bash
# Проверить что контейнеры запущены
docker-compose ps

# Проверить логи фронтенда
docker-compose logs -f web

# Проверить логи бэкенда
docker-compose logs -f backend
```

### 8. Проверить в браузере
1. Открыть https://test.soldium.ru/register
2. Попробовать зарегистрироваться
3. Открыть DevTools (F12) → Network
4. Проверить что URL запроса правильный: `https://testapi.soldium.ru/api/auth/register/`

## Если проблема осталась

### Проверить VITE_API_URL внутри контейнера
```bash
docker exec nfc_web sh -c "cat /usr/share/nginx/html/index.html | grep VITE_API_URL"
```

### Проверить .env файл на сервере
```bash
cat /root/nfc/web/.env
```
Должно быть: `VITE_API_URL=https://testapi.soldium.ru/api`

### Очистить build кэш Docker
```bash
docker-compose down web
docker rmi nfc-medical-web:latest
docker-compose build --no-cache web
docker-compose up -d web
```

## Важно!

Vite встраивает переменные окружения в build time, поэтому:
- ⚠️ Изменения в `.env` требуют **пересборки** образа
- ⚠️ Просто перезапуск контейнера **НЕ подхватит** новые значения
- ✅ Всегда используйте `docker-compose build --no-cache web` после изменения `.env`

## Проверка после деплоя

### 1. URL запросов в браузере
Должны быть:
- ✅ `https://testapi.soldium.ru/api/auth/register/`
- ✅ `https://testapi.soldium.ru/api/auth/login/`
- ❌ НЕ `https://test.soldium.ru/testapi.soldium.ru/...`

### 2. Логи бэкенда
Не должно быть ошибок:
- ❌ `Invalid HTTP_HOST header: 'soldium.ru'`
- ✅ Запросы должны проходить успешно

### 3. CORS
Если будут CORS ошибки в браузере, проверить что в бэкенде `backend/config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://test.soldium.ru",
    "https://testapi.soldium.ru",
]
```

## Контакты для отладки

Если что-то пойдет не так, проверьте:
1. `docker-compose logs backend` - логи Django
2. `docker-compose logs web` - логи Nginx фронтенда
3. `docker logs soldium-nginx` - логи главного Nginx
4. Браузер DevTools → Console - ошибки JS
5. Браузер DevTools → Network - запросы к API
