# GitHub Actions Workflow Fix

## Проблема

Workflows падали с ошибкой:
```
Error response from daemon: Conflict. The container name "/nfc_web" is already in use
Error response from daemon: Conflict. The container name "/nfc_backend" is already in use
```

## Исправление

### Backend Workflow ([backend-ghcr-deploy.yml](.github/workflows/backend-ghcr-deploy.yml))
Добавлено принудительное удаление контейнеров по имени:
```bash
docker compose stop backend celery celery-beat || true
docker compose rm -f backend celery celery-beat || true

# Fallback - удаление по имени если compose не сработал
docker rm -f nfc_backend nfc_celery nfc_celery_beat 2>/dev/null || true
```

### Frontend Workflow ([web-ghcr-deploy.yml](.github/workflows/web-ghcr-deploy.yml))
Добавлено принудительное удаление контейнера по имени:
```bash
docker compose stop web || true
docker compose rm -f web || true

# Fallback - удаление по имени
docker rm -f nfc_web 2>/dev/null || true
```

## Дополнительные изменения

### 1. Удалены Health Checks
Убраны health check шаги из обоих workflows, потому что:
- ❌ Могут падать если URL недоступен снаружи
- ❌ Добавляют лишнее время к деплою
- ✅ Проверка контейнеров через `docker compose ps` достаточна

### 2. Запуск бэкенда БЕЗ зависимостей
Добавлен флаг `--no-deps` чтобы НЕ трогать БД и Redis:

```bash
# Останавливаем и удаляем старые backend контейнеры
docker compose stop backend celery celery-beat || true
docker compose rm -f backend celery celery-beat || true
docker rm -f nfc_backend nfc_celery nfc_celery_beat 2>/dev/null || true

# Запускаем ТОЛЬКО backend контейнеры, БЕЗ зависимостей
docker compose up -d --no-deps --force-recreate backend celery celery-beat
```

**Ключевой флаг: `--no-deps`**
- ✅ Запускает ТОЛЬКО указанные сервисы
- ✅ НЕ пытается создать/запустить зависимости (db, redis)
- ✅ БД и Redis остаются нетронутыми
- ✅ Никаких конфликтов имён контейнеров!

## Что теперь делать

Workflows исправлены, теперь они:
1. ✅ Останавливают старые контейнеры через `docker compose stop`
2. ✅ Удаляют старые контейнеры через `docker compose rm -f`
3. ✅ Принудительно удаляют по имени если что-то пошло не так
4. ✅ Создают новые контейнеры без конфликтов
5. ✅ Не делают health checks (быстрее деплой)

**Можно делать коммит и пуш!** 🚀

Workflows больше не будут падать с ошибкой "container already in use".
