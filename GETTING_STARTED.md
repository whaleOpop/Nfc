# Getting Started

Добро пожаловать в NFC Medical Platform! Это руководство поможет вам быстро начать работу с проектом.

## Что это?

NFC Medical Platform - это комплексная система для экстренного доступа к медицинской информации через NFC метки. Система состоит из:

- **Backend API** (Django + PostgreSQL) - Основной сервер
- **Mobile App** (Flutter) - Мобильное приложение для iOS/Android
- **Web Platform** (React) - Веб-интерфейс для пациентов, врачей и администраторов

## Быстрый старт (5 минут)

### 1. Требования

Убедитесь, что у вас установлено:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### 2. Клонируйте репозиторий

```bash
git clone <repository-url>
cd Nfc
```

### 3. Запустите проект

```bash
# Создайте .env файл
cd backend
cp .env.example .env
cd ..

# Запустите Docker Compose
docker-compose up -d
```

### 4. Инициализируйте базу данных

```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### 5. Откройте приложение

- **API Documentation**: http://localhost:8000/api/docs/
- **Admin Panel**: http://localhost:8000/admin/
- **Web App**: http://localhost:3000/

## Что дальше?

### Для Backend разработчиков

1. Прочитайте [Backend README](./backend/README.md)
2. Изучите [API Documentation](./docs/API.md)
3. Ознакомьтесь с моделями данных в [django/apps/](./backend/apps/)

### Для Frontend разработчиков (Web)

1. Прочитайте [Web README](./web/README.md)
2. Установите зависимости: `cd web && npm install`
3. Запустите dev сервер: `npm run dev`

### Для Mobile разработчиков

1. Прочитайте [Mobile README](./mobile/README.md)
2. Установите зависимости: `cd mobile && flutter pub get`
3. Запустите приложение: `flutter run`

## Структура проекта

```
nfc-medical-platform/
├── backend/              # Django REST API
│   ├── apps/
│   │   ├── authentication/  # Аутентификация и пользователи
│   │   ├── profiles/        # Медицинские профили
│   │   ├── nfc/             # NFC метки и логика
│   │   └── audit/           # Аудит и безопасность
│   ├── config/           # Настройки Django
│   └── manage.py
│
├── mobile/               # Flutter приложение
│   ├── lib/
│   │   ├── models/       # Модели данных
│   │   ├── services/     # API сервисы
│   │   ├── screens/      # Экраны приложения
│   │   └── widgets/      # UI компоненты
│   └── pubspec.yaml
│
├── web/                  # React веб-приложение
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── pages/        # Страницы
│   │   ├── services/     # API сервисы
│   │   └── utils/        # Утилиты
│   └── package.json
│
├── docs/                 # Документация
│   ├── API.md
│   ├── NFC_PROTOCOL.md
│   ├── DEPLOYMENT.md
│   └── QUICK_START.md
│
└── docker-compose.yml    # Docker конфигурация
```

## Основные концепции

### NFC Метки

Пациенты регистрируют NFC метки (NTAG215), которые содержат только идентификатор. Медицинские данные НЕ хранятся на метке, только ссылка на профиль.

### Роли пользователей

- **Пациент**: Управляет своим медицинским профилем и NFC метками
- **Медработник**: Сканирует метки и получает экстренный доступ к данным
- **Администратор**: Управляет системой и пользователями
- **Супер-админ**: Полный доступ ко всем функциям

### Безопасность

- JWT токены для аутентификации
- 2FA (Two-Factor Authentication)
- HMAC контрольные суммы для NFC меток
- Полное логирование всех действий
- Шифрование чувствительных данных

## Разработка

### Backend

```bash
# Запустить Django сервер
docker-compose up backend

# Создать миграции
docker-compose exec backend python manage.py makemigrations

# Применить миграции
docker-compose exec backend python manage.py migrate

# Запустить тесты
docker-compose exec backend pytest
```

### Mobile

```bash
cd mobile

# Установить зависимости
flutter pub get

# Запустить на Android
flutter run

# Запустить на iOS
flutter run -d ios

# Собрать APK
flutter build apk --release
```

### Web

```bash
cd web

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Собрать для продакшена
npm run build

# Запустить линтер
npm run lint
```

## API Примеры

### Регистрация

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "password2": "SecurePass123",
    "first_name": "Иван",
    "last_name": "Петров"
  }'
```

### Вход

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Создание профиля

```bash
curl -X POST http://localhost:8000/api/profile/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "blood_type": "A+",
    "height": 180,
    "weight": 75,
    "is_public": true
  }'
```

## Тестирование

### Backend тесты

```bash
docker-compose exec backend pytest
docker-compose exec backend pytest --cov
```

### Mobile тесты

```bash
cd mobile
flutter test
```

### Web тесты

```bash
cd web
npm run test
```

## Деплой

Для деплоя на продакшен сервер следуйте инструкциям в [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## Частые вопросы

### Как изменить порт Backend?

Отредактируйте `docker-compose.yml`:
```yaml
backend:
  ports:
    - "8001:8000"  # Внешний:Внутренний
```

### Как сбросить базу данных?

```bash
docker-compose down -v
docker-compose up -d
docker-compose exec backend python manage.py migrate
```

### Как добавить тестовые данные?

Используйте Django Admin или создайте fixtures:
```bash
docker-compose exec backend python manage.py loaddata fixtures/test_data.json
```

## Полезные ресурсы

### Документация
- [API Documentation](./docs/API.md) - Полная документация API
- [NFC Protocol](./docs/NFC_PROTOCOL.md) - Протокол работы с NFC
- [Quick Start](./docs/QUICK_START.md) - Быстрый старт для разработчиков
- [Deployment](./docs/DEPLOYMENT.md) - Инструкции по деплою

### Технологии
- [Django](https://www.djangoproject.com/) - Python Web Framework
- [Django REST Framework](https://www.django-rest-framework.org/) - REST API
- [Flutter](https://flutter.dev/) - Mobile Development
- [React](https://react.dev/) - Web UI Framework
- [Material-UI](https://mui.com/) - React UI Components

### Инструменты
- [Docker](https://www.docker.com/) - Контейнеризация
- [PostgreSQL](https://www.postgresql.org/) - База данных
- [Redis](https://redis.io/) - Кэширование
- [Celery](https://docs.celeryq.dev/) - Асинхронные задачи

## Поддержка

Если у вас возникли проблемы:

1. Проверьте [документацию](./docs/)
2. Посмотрите логи: `docker-compose logs`
3. Создайте issue в GitHub
4. Свяжитесь с командой: support@nfc-medical.ru

## Лицензия

Proprietary - см. LICENSE файл

---

**Готовы начать?** Следуйте инструкциям в разделе "Быстрый старт" выше!
