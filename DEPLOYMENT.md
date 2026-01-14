# 🚀 Deployment Guide

Полное руководство по развертыванию NFC Medical Platform.

## 📋 Варианты развертывания

### 🌐 Frontend

#### Вариант 1: GitHub Pages (Рекомендуется)
**Преимущества**: Бесплатно, HTTPS, CDN, автодеплой

**Настройка**: См. [.github/GITHUB_PAGES_SETUP.md](.github/GITHUB_PAGES_SETUP.md)

**Процесс**:
1. Settings → Pages → Source: GitHub Actions
2. Добавить secret `VITE_API_URL`
3. Push в main → автодеплой

**URL**: `https://<username>.github.io/<repo-name>/`

---

#### Вариант 2: Self-hosted Server
**Преимущества**: Полный контроль, custom domain без ограничений

**Требования**:
- Сервер с Nginx
- SSH доступ
- Node.js для сборки

**Процесс**: Используйте workflow `web-deploy.yml`

---

### 🔧 Backend

**Требуется**: Собственный сервер (VPS/Dedicated)

**Технологии**: Django + PostgreSQL + Redis + Docker

**Процесс**:
1. Настройте сервер (см. [.github/SERVER_SETUP.sh](.github/SERVER_SETUP.sh))
2. Настройте GitHub Secrets (см. [.github/SECRETS_SETUP.md](.github/SECRETS_SETUP.md))
3. Push в main → автодеплой через `backend-deploy.yml`

---

### 📱 Mobile Apps

**Android**:
- Workflow: `android-build.yml`
- Артефакты: APK + AAB
- Релизы: Автоматические GitHub Releases

**iOS**:
- Workflow: `ios-build.yml`
- Артефакты: IPA (без code signing)
- Требует: macOS для финальной подписи

---

## 🎯 Рекомендуемая архитектура

```
┌─────────────────────────────────────────────┐
│           Internet Users                    │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼─────┐   ┌──────▼──────┐
│  Frontend  │   │   Backend   │
│   GitHub   │   │ Self-hosted │
│   Pages    │   │   Server    │
│            │   │             │
│  React/    │   │  Django +   │
│  Vite      │   │  PostgreSQL │
│            │   │  + Redis    │
│  FREE ✅   │   │  + Docker   │
│  HTTPS ✅  │   │             │
└────────────┘   └─────────────┘
```

**Почему эта архитектура?**
- ✅ Frontend на GitHub Pages = $0/месяц
- ✅ Backend на VPS = ~$5-20/месяц (Hetzner, DigitalOcean)
- ✅ Разделение frontend/backend = независимое масштабирование
- ✅ HTTPS на frontend автоматически
- ✅ CDN для frontend из коробки

---

## ⚙️ Полная настройка с нуля

### Шаг 1: Подготовка Backend сервера

```bash
# На вашем локальном компьютере
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# На сервере (через SSH)
curl -O https://raw.githubusercontent.com/your-username/nfc-medical/main/.github/SERVER_SETUP.sh
chmod +x SERVER_SETUP.sh
sudo ./SERVER_SETUP.sh
```

### Шаг 2: Настройка GitHub Secrets

Перейдите в **Settings** → **Secrets and variables** → **Actions**

**Минимальный набор для GitHub Pages + Backend**:
```bash
# Backend
SSH_PRIVATE_KEY=<ваш приватный ключ>
SERVER_HOST=<IP или домен сервера>
SERVER_USER=<пользователь SSH>
SERVER_PATH=/var/www/nfc-medical
BACKEND_URL=https://api.yourdomain.com

# Frontend (GitHub Pages)
VITE_API_URL=https://api.yourdomain.com
```

### Шаг 3: Включите GitHub Pages

1. **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Сохраните

### Шаг 4: Deploy!

```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

Workflows автоматически:
- ✅ Соберут Android и iOS приложения
- ✅ Задеплоят backend на ваш сервер
- ✅ Опубликуют frontend на GitHub Pages

---

## 📊 Мониторинг деплоев

### GitHub Actions
Перейдите в **Actions** tab для просмотра:
- ✅ Статус всех workflows
- 📝 Логи выполнения
- ⏱️ История деплоев

### Проверка статуса

```bash
# Backend health check
curl https://api.yourdomain.com/api/health/

# Frontend
curl https://username.github.io/repo-name/
```

---

## 🔐 Безопасность

### GitHub Secrets
- ✅ Никогда не коммитьте приватные ключи
- ✅ Используйте отдельный SSH ключ только для CI/CD
- ✅ Регулярно ротируйте ключи

### Backend
- ✅ Используйте HTTPS (Let's Encrypt)
- ✅ Настройте firewall (UFW)
- ✅ Ограничьте SSH доступ
- ✅ Регулярные backup БД

### CORS настройки
```python
# backend/config/settings.py
CORS_ALLOWED_ORIGINS = [
    'https://yourusername.github.io',  # GitHub Pages
    'https://yourdomain.com',           # Custom domain (опционально)
]
```

---

## 🐛 Troubleshooting

### Frontend не загружается
1. Проверьте, что GitHub Pages включен
2. Проверьте логи workflow в Actions
3. Убедитесь, что `VITE_BASE_URL` настроен правильно

### Backend не доступен
1. Проверьте SSH подключение: `ssh user@server`
2. Проверьте Docker: `docker-compose ps`
3. Проверьте логи: `docker-compose logs backend`

### CORS ошибки
1. Добавьте домен GitHub Pages в `CORS_ALLOWED_ORIGINS`
2. Перезапустите backend: `docker-compose restart backend`

### Mobile builds падают
1. Проверьте версию Flutter в workflow
2. Проверьте dependencies в `pubspec.yaml`
3. Проверьте логи в Actions

---

## 📈 Масштабирование

### Frontend
GitHub Pages автоматически предоставляет:
- ✅ CDN (Content Delivery Network)
- ✅ Кэширование
- ✅ DDoS защиту

### Backend
Для масштабирования backend:
1. Увеличьте ресурсы сервера (CPU/RAM)
2. Добавьте load balancer
3. Используйте managed PostgreSQL
4. Настройте Redis cluster
5. Добавьте Celery workers

---

## 💰 Стоимость

### Вариант 1: Минимальный (GitHub Pages)
- Frontend: **$0** (GitHub Pages)
- Backend: **$5-10/мес** (VPS 1-2GB RAM)
- **Итого: $5-10/мес**

### Вариант 2: Self-hosted всё
- Frontend: **$5/мес** (тот же VPS)
- Backend: **$5/мес** (тот же VPS)
- **Итого: $5/мес** (но больше работы по настройке)

### Вариант 3: Production-ready
- Frontend: **$0** (GitHub Pages)
- Backend: **$20-50/мес** (Dedicated VPS)
- Database: **$15-50/мес** (Managed PostgreSQL)
- **Итого: $35-100/мес**

---

## 📚 Документация

- [GitHub Pages Setup](.github/GITHUB_PAGES_SETUP.md) - Быстрый старт GitHub Pages
- [Secrets Setup](.github/SECRETS_SETUP.md) - Полный список secrets
- [Workflows README](.github/workflows/README.md) - Детали всех workflows
- [Server Setup](.github/SERVER_SETUP.sh) - Автоматическая настройка сервера

---

## 🆘 Поддержка

При проблемах:
1. Проверьте логи в **Actions** tab
2. Проверьте статус сервера
3. Проверьте GitHub Secrets
4. Изучите документацию выше

---

## ✅ Checklist перед первым деплоем

- [ ] Backend сервер настроен и доступен
- [ ] SSH ключ сгенерирован и добавлен на сервер
- [ ] GitHub Secrets настроены
- [ ] GitHub Pages включен (Source: GitHub Actions)
- [ ] `.env` файл создан на backend сервере
- [ ] Docker и Docker Compose установлены
- [ ] Nginx установлен (если self-hosted frontend)
- [ ] Firewall настроен (порты 22, 80, 443)
- [ ] SSL сертификат настроен (Let's Encrypt)

После проверки всех пунктов:
```bash
git push origin main
```

И наблюдайте за магией автоматического деплоя! 🚀
