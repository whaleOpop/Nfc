# Release 1.0.0 - Deployment Instructions

## Что будет пересобрано

При пуше этих изменений GitHub Actions автоматически пересоберёт:

✅ **Backend** - из-за изменения `docker-compose.yml`
✅ **Web Frontend** - из-за изменения `docker-compose.yml` и `web/**` файлов
✅ **iOS App** - триггерится на любой push в `main`
✅ **Android App** - триггерится на любой push в `main`

## Шаг 1: Обновить GitHub Secrets

Перейди на https://github.com/whaleOpop/Nfc/settings/secrets/actions

Обнови/добавь эти secrets:

```
VITE_API_URL = https://testapi.soldium.ru/api
VITE_APP_NAME = NFC Medical Platform
WEB_URL = https://test.soldium.ru
SERVER_PATH = /root/nfc-app
```

Проверь что есть все остальные secrets:
- `SSH_PRIVATE_KEY` - SSH ключ для деплоя
- `SERVER_HOST` - 46.173.18.72
- `SERVER_USER` - root
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `DB_PASSWORD`, `REDIS_PASSWORD`
- `SECRET_KEY` для Django

## Шаг 2: Закоммитить все изменения

```bash
# Проверить статус
git status

# Добавить все новые файлы
git add .

# Коммит с версией
git commit -m "🎉 Release v1.0.0 - Complete Frontend Implementation

- Add full web frontend with all pages (Login, Register, Dashboard, Profile, NFC Management, Admin Panel, Emergency Access)
- Add API service layer with JWT auto-refresh
- Add AuthContext for global authentication state
- Fix frontend API URL configuration (https://testapi.soldium.ru/api)
- Add comprehensive documentation
- Create VERSION and CHANGELOG files
- Update docker-compose.yml with version info

This release includes:
- 7 complete frontend pages
- API integration with backend
- Protected routes
- Emergency access public page
- Complete documentation
"

# Пуш в main ветку
git push origin main
```

## Шаг 3: Следить за GitHub Actions

Перейди на https://github.com/whaleOpop/Nfc/actions

Будут запущены 4 workflow:
1. ✅ **Backend Build & Deploy** (~5-10 минут)
2. ✅ **Web Frontend Build & Deploy** (~5-10 минут)
3. ✅ **iOS Build** (~15-20 минут)
4. ✅ **Android Build** (~10-15 минут)

## Шаг 4: После деплоя - обновить .env на сервере

Когда Backend и Web workflows завершатся успешно:

```bash
ssh root@46.173.18.72
cd /root/nfc-app
nano .env
```

Убедись что есть эти строки:
```env
# Backend
ALLOWED_HOSTS=localhost,127.0.0.1,46.173.18.72,testapi.soldium.ru,test.soldium.ru,soldium.ru

# Frontend (должны быть автоматически добавлены workflow)
VITE_API_URL=https://testapi.soldium.ru/api
VITE_APP_NAME=NFC Medical Platform
VITE_ENVIRONMENT=production
NODE_ENV=production
```

Если `ALLOWED_HOSTS` не содержит `soldium.ru`, добавь его.

Сохрани (Ctrl+O, Enter, Ctrl+X) и перезапусти бэкенд:
```bash
docker-compose restart backend celery celery-beat
```

## Шаг 5: Проверить что всё работает

### Web Frontend
```bash
# Проверить контейнеры
docker-compose ps

# Логи фронтенда
docker-compose logs -f web

# Логи бэкенда
docker-compose logs -f backend
```

### В браузере
1. Открыть https://test.soldium.ru/register
2. Зарегистрировать тестового пользователя
3. Проверить Dashboard
4. Создать NFC метку
5. Проверить Emergency Access по QR-коду

### DevTools проверка
1. Открыть DevTools (F12)
2. Перейти на Network tab
3. Проверить что запросы идут на правильный URL:
   - ✅ `https://testapi.soldium.ru/api/auth/register/`
   - ✅ `https://testapi.soldium.ru/api/profiles/medical-profile/`
   - ❌ НЕ `https://test.soldium.ru/testapi.soldium.ru/...`

### Mobile Apps
После завершения iOS и Android workflows:
1. Скачать IPA из GitHub Releases
2. Скачать APK из GitHub Releases
3. Протестировать на устройствах

## Шаг 6: Создать GitHub Release

После успешного деплоя:

1. Перейди на https://github.com/whaleOpop/Nfc/releases/new
2. Tag: `v1.0.0`
3. Title: `Release v1.0.0 - Complete Frontend Implementation`
4. Description: Скопируй из `CHANGELOG.md`
5. Прикрепи артефакты:
   - iOS IPA файл (из Actions artifacts)
   - Android APK файл (из Actions artifacts)
6. Publish release

## Rollback Plan

Если что-то пойдёт не так:

### Откатить фронтенд на предыдущую версию
```bash
ssh root@46.173.18.72
cd /root/nfc-app
nano .env
```

Измени IMAGE_TAG на предыдущий:
```env
IMAGE_TAG=sha-f056626
```

Перезапусти:
```bash
docker-compose pull web
docker-compose up -d web --force-recreate
```

### Откатить бэкенд
```bash
# В .env измени IMAGE_TAG для бэкенда
IMAGE_TAG=sha-ea9e145

docker-compose pull backend
docker-compose up -d backend --force-recreate
docker-compose restart celery celery-beat
```

## Мониторинг после релиза

### Первые 24 часа
- Следить за логами: `docker-compose logs -f`
- Проверять метрики в Grafana: http://46.173.18.72:3000
- Мониторить ошибки в бэкенде

### Первая неделя
- Собирать фидбек от пользователей
- Мониторить производительность
- Отслеживать новые баги

## Контакты

При проблемах проверить:
1. GitHub Actions logs
2. `docker-compose logs backend`
3. `docker-compose logs web`
4. Browser DevTools Console/Network
5. Nginx logs: `docker logs soldium-nginx`

---

**Готов к релизу!** 🚀
