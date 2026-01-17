# Local Development Guide

Быстрый старт для локальной разработки.

## ✅ Что уже запущено

### Frontend (React + Vite)
- **Статус**: ✅ Запущен
- **URL**: http://localhost:3000
- **Файлы**: `c:\Users\User\Desktop\Nfc\web`

## 🔧 Backend (Django + PostgreSQL + Redis)

### Проблема
Docker Desktop не запущен. Для backend нужны:
- PostgreSQL (база данных)
- Redis (кэш и очереди)
- Django backend сервер

### Решение 1: Запустить с Docker (Рекомендуется)

1. **Запустите Docker Desktop**
   - Откройте Docker Desktop из меню Пуск
   - Дождитесь полного запуска (иконка станет зелёной)

2. **Запустите backend сервисы**
   ```bash
   cd "c:\Users\User\Desktop\Nfc"
   docker-compose up -d db redis backend
   ```

3. **Проверьте статус**
   ```bash
   docker-compose ps
   ```

4. **Backend будет доступен на**: http://localhost:8000

---

### Решение 2: Запустить без Docker (Сложнее)

Если не хотите использовать Docker:

#### Шаг 1: Установите PostgreSQL
1. Скачайте: https://www.postgresql.org/download/windows/
2. Установите с настройками по умолчанию
3. Создайте БД:
   ```sql
   CREATE DATABASE nfc_medical;
   CREATE USER nfc_user WITH PASSWORD 'changeme';
   GRANT ALL PRIVILEGES ON DATABASE nfc_medical TO nfc_user;
   ```

#### Шаг 2: Установите Redis
1. Скачайте: https://github.com/microsoftarchive/redis/releases
2. Установите и запустите как службу

#### Шаг 3: Настройте backend
```bash
cd "c:\Users\User\Desktop\Nfc\backend"

# Создайте виртуальное окружение
python -m venv venv
venv\Scripts\activate

# Установите зависимости
pip install -r requirements.txt

# Обновите .env файл
# DB_HOST=localhost (вместо db)
# REDIS_HOST=localhost (вместо redis)

# Выполните миграции
python manage.py migrate

# Создайте суперпользователя
python manage.py createsuperuser

# Запустите сервер
python manage.py runserver
```

---

## 📱 Mobile (Flutter)

### Статус
Зависимости установлены ✅

### Запуск

1. **Подключите устройство или эмулятор**
   ```bash
   # Проверьте устройства
   flutter devices
   ```

2. **Запустите приложение**
   ```bash
   cd "c:\Users\User\Desktop\Nfc\mobile"
   flutter run
   ```

3. **Для hot reload**
   - Нажмите `r` в терминале для hot reload
   - Нажмите `R` для full restart
   - Нажмите `q` для выхода

---

## 🔗 Архитектура

```
┌─────────────────┐
│   Mobile App    │  Flutter (iOS/Android)
│  localhost:N/A  │  (on device/emulator)
└────────┬────────┘
         │
         ├──────────┐
         │          │
┌────────▼────┐  ┌──▼──────────┐
│  Frontend   │  │   Backend   │
│  React/Vite │  │   Django    │
│  :3000      │  │   :8000     │
└─────────────┘  └──────┬──────┘
                        │
                 ┌──────┴──────┐
                 │             │
         ┌───────▼──┐  ┌──────▼─────┐
         │PostgreSQL│  │   Redis    │
         │  :5432   │  │   :6379    │
         └──────────┘  └────────────┘
```

---

## 🧪 Тестирование

### Проверка Frontend
1. Откройте http://localhost:3000
2. Должна открыться страница приложения
3. Если backend не запущен, API запросы будут падать с ошибкой

### Проверка Backend
1. Откройте http://localhost:8000/api/
2. Должен показаться API root или документация
3. Проверьте health check: http://localhost:8000/api/health/

### Проверка Mobile
1. Запустите `flutter run`
2. Приложение запустится на устройстве
3. Проверьте что API запросы идут на правильный адрес

---

## 🐛 Troubleshooting

### Frontend не загружается
```bash
# Проверьте что сервер запущен
cd "c:\Users\User\Desktop\Nfc\web"
npm run dev
```

### Backend не запускается
```bash
# Проверьте Docker
docker ps

# Проверьте логи
docker-compose logs backend

# Перезапустите
docker-compose restart backend
```

### Mobile не подключается к API
1. Проверьте IP адрес компьютера: `ipconfig`
2. Обновите в mobile/lib/services/api_service.dart:
   ```dart
   static const String baseUrl = 'http://YOUR_IP:8000';
   ```
3. Для Android эмулятора используйте: `http://10.0.2.2:8000`
4. Для iOS симулятора используйте: `http://localhost:8000`

---

## 📝 Полезные команды

### Docker
```bash
# Запустить всё
docker-compose up -d

# Остановить всё
docker-compose down

# Посмотреть логи
docker-compose logs -f backend

# Выполнить миграции
docker-compose exec backend python manage.py migrate

# Создать суперпользователя
docker-compose exec backend python manage.py createsuperuser

# Перезапустить backend
docker-compose restart backend
```

### Frontend
```bash
cd web

# Dev сервер
npm run dev

# Build для production
npm run build

# Preview production build
npm run preview

# Линтинг
npm run lint
```

### Backend (без Docker)
```bash
cd backend
venv\Scripts\activate

# Миграции
python manage.py makemigrations
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Запустить dev сервер
python manage.py runserver

# Создать тестовые данные
python manage.py loaddata fixtures/test_data.json

# Запустить тесты
pytest

# Запустить Celery worker (в отдельном терминале)
celery -A config worker -l info
```

### Mobile
```bash
cd mobile

# Обновить зависимости
flutter pub get

# Запустить на конкретном устройстве
flutter run -d <device-id>

# Запустить в release режиме
flutter run --release

# Очистить build
flutter clean

# Проверить зависимости
flutter doctor
```

---

## 🎯 Next Steps

После запуска всех сервисов:

1. **Backend Admin**: http://localhost:8000/admin
   - Создайте суперпользователя через `createsuperuser`
   - Войдите в админку

2. **API Docs**: http://localhost:8000/api/docs
   - Swagger UI документация
   - Протестируйте endpoints

3. **Frontend**: http://localhost:3000
   - Должна работать регистрация/логин
   - Проверьте интеграцию с API

4. **Mobile App**
   - Запустите на эмуляторе/устройстве
   - Протестируйте функциональность
