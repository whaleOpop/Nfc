# NFC Medical Web Platform

Веб-платформа для управления медицинскими профилями и NFC метками.

## Технологии

- **React** 18.2+
- **Vite** - Build tool
- **Material-UI** - UI компоненты
- **React Router** - Навигация
- **React Query** - Управление состоянием сервера
- **Zustand** - Управление локальным состоянием
- **Axios** - HTTP клиент
- **React Hook Form** - Формы
- **Recharts** - Графики

## Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── Layout/
│   ├── Dashboard/
│   ├── Profile/
│   ├── NFC/
│   └── Common/
├── pages/              # Страницы
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── NFCManagement.jsx
│   └── AdminPanel.jsx
├── services/           # API сервисы
│   ├── api.js
│   ├── authService.js
│   ├── profileService.js
│   └── nfcService.js
├── contexts/           # React контексты
│   └── AuthContext.jsx
├── utils/              # Утилиты
│   ├── constants.js
│   ├── validators.js
│   └── helpers.js
├── App.jsx             # Главный компонент
└── main.jsx            # Точка входа
```

## Установка

```bash
cd web
npm install
```

## Разработка

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в директории `dist/`

## Основные функции

### Для пациентов
- Личный кабинет
- Управление медицинским профилем
- Управление NFC метками
- История доступа к данным
- Настройки приватности

### Для медработников
- Просмотр экстренных данных пациентов
- Добавление заметок к профилям

### Для администраторов
- Управление пользователями
- Просмотр логов и статистики
- Управление доступом
- Мониторинг безопасности

## API Интеграция

API базовый URL: `http://localhost:8000/api`

Все запросы требуют авторизации через JWT токен в заголовке:
```
Authorization: Bearer <access_token>
```

## Переменные окружения

Создайте файл `.env`:

```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=NFC Medical Platform
```

## Стили

Проект использует Material-UI с кастомной темой. Основные цвета:
- Primary: `#1976d2` (синий)
- Secondary: `#2e7d32` (зеленый)

## Тестирование

```bash
npm run test
```

## Линтинг

```bash
npm run lint
```

## Форматирование

```bash
npm run format
```

## Docker

```bash
docker build -t nfc-medical-web .
docker run -p 80:80 nfc-medical-web
```

## Лицензия

Proprietary
