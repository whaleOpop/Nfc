# GitHub Secrets Configuration Guide

Это руководство по настройке GitHub Secrets для CI/CD workflows.

## 📍 Где настроить secrets

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**

---

## 🔐 Необходимые Secrets

### GitHub Pages Deployment (Рекомендуется для Frontend)

**Преимущества**: Бесплатный хостинг, HTTPS из коробки, не требует собственного сервера

| Secret Name | Описание | Пример | Обязательно |
|------------|----------|--------|-------------|
| `VITE_API_URL` | URL backend API | `https://api.example.com` | ✅ |
| `VITE_APP_NAME` | Название приложения | `NFC Medical Platform` | ❌ |

**Настройка GitHub Pages**:
1. Откройте **Settings** → **Pages**
2. В секции **Source** выберите **GitHub Actions**
3. При push в `main` автоматически деплоится на `https://<username>.github.io/<repo-name>/`

⚠️ **Важно**: Если ваш репозиторий называется `username.github.io`, приложение будет доступно напрямую по `https://username.github.io/` без имени репозитория в пути.

---

### Backend Deployment

| Secret Name | Описание | Пример |
|------------|----------|--------|
| `SSH_PRIVATE_KEY` | SSH приватный ключ для доступа к серверу | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_HOST` | IP адрес или домен сервера | `123.45.67.89` или `api.example.com` |
| `SERVER_USER` | Пользователь SSH на сервере | `root` или `ubuntu` |
| `SERVER_PATH` | Путь к проекту на сервере | `/var/www/nfc-medical` |
| `BACKEND_URL` | URL для health check | `https://api.example.com` |

### Self-hosted Frontend Deployment (Опционально)

**Используйте только если НЕ используете GitHub Pages**

| Secret Name | Описание | Пример |
|------------|----------|--------|
| `SSH_PRIVATE_KEY` | SSH приватный ключ (тот же что для backend) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_HOST` | IP адрес или домен сервера (может быть другой) | `123.45.67.89` |
| `SERVER_USER` | Пользователь SSH | `root` |
| `WEB_PATH` | Путь к директории nginx | `/var/www/html/nfc-medical` |
| `WEB_URL` | URL для health check | `https://example.com` |
| `VITE_API_URL` | URL backend API для React | `https://api.example.com` |
| `VITE_APP_NAME` | Название приложения | `NFC Medical` |

---

## 🔧 Генерация SSH ключа

Для доступа к серверу через SSH:

```bash
# 1. Генерируем новый SSH ключ
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# 2. Копируем публичный ключ на сервер
ssh-copy-id -i ~/.ssh/github_actions.pub user@your-server.com

# 3. Копируем приватный ключ в буфер обмена
cat ~/.ssh/github_actions
# Скопируйте весь вывод включая строки BEGIN и END
```

Добавьте содержимое приватного ключа в GitHub Secret `SSH_PRIVATE_KEY`.

---

## 📦 Настройка сервера

### Backend (Django)

Убедитесь, что на сервере:

1. Установлен Docker и Docker Compose:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo usermod -aG docker $USER
   ```

2. Создана директория проекта:
   ```bash
   sudo mkdir -p /var/www/nfc-medical
   sudo chown $USER:$USER /var/www/nfc-medical
   ```

3. Клонирован репозиторий:
   ```bash
   cd /var/www/nfc-medical
   git clone https://github.com/your-username/nfc-medical.git .
   ```

4. Создан `.env` файл:
   ```bash
   cd backend
   cp .env.example .env
   nano .env  # настройте переменные окружения
   ```

### Frontend (React + Nginx)

1. Установлен Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. Создана директория для frontend:
   ```bash
   sudo mkdir -p /var/www/html/nfc-medical
   sudo chown www-data:www-data /var/www/html/nfc-medical
   ```

3. Настроен Nginx конфигурация:
   ```nginx
   # /etc/nginx/sites-available/nfc-medical
   server {
       listen 80;
       server_name example.com;
       root /var/www/html/nfc-medical;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

4. Активирован сайт:
   ```bash
   sudo ln -s /etc/nginx/sites-available/nfc-medical /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 🔍 Проверка настройки

После настройки всех secrets:

1. **Backend**: Проверьте, что можете подключиться по SSH:
   ```bash
   ssh $SERVER_USER@$SERVER_HOST
   ```

2. **Frontend**: Убедитесь, что nginx запущен:
   ```bash
   sudo systemctl status nginx
   ```

3. **GitHub Actions**: Сделайте коммит и проверьте выполнение workflows в разделе **Actions**.

---

## 🚨 Важные примечания

1. **Безопасность SSH ключей**:
   - Никогда не коммитьте SSH ключи в репозиторий
   - Используйте отдельный ключ только для CI/CD
   - Ограничьте права доступа ключа на сервере

2. **Права доступа на сервере**:
   - Backend: пользователь должен иметь доступ к Docker
   - Frontend: директория должна принадлежать `www-data`

3. **Firewall**:
   - Откройте порт 22 для SSH
   - Откройте порт 80/443 для HTTP/HTTPS
   - Для backend API может потребоваться дополнительный порт

4. **HTTPS**:
   - Рекомендуется настроить SSL сертификат (Let's Encrypt)
   - Используйте certbot для автоматического обновления

---

## 📝 Пример команд для быстрой настройки

```bash
# На вашем компьютере
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
ssh-copy-id -i ~/.ssh/github_actions.pub root@YOUR_SERVER_IP

# На сервере
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose nginx -y
sudo usermod -aG docker $USER
sudo mkdir -p /var/www/nfc-medical /var/www/html/nfc-medical
sudo chown $USER:$USER /var/www/nfc-medical
sudo chown www-data:www-data /var/www/html/nfc-medical

# Клонирование репозитория
cd /var/www/nfc-medical
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
```

---

## 🆘 Troubleshooting

### Проблема: SSH connection failed
- Проверьте правильность `SERVER_HOST` и `SERVER_USER`
- Убедитесь, что публичный ключ добавлен на сервер
- Проверьте firewall на сервере: `sudo ufw status`

### Проблема: Docker permission denied
```bash
# На сервере
sudo usermod -aG docker $USER
newgrp docker
```

### Проблема: Nginx 403 Forbidden
```bash
# На сервере
sudo chown -R www-data:www-data /var/www/html/nfc-medical
sudo chmod -R 755 /var/www/html/nfc-medical
```

---

## 📚 Дополнительные ресурсы

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [SSH Key Authentication](https://www.ssh.com/academy/ssh/keygen)
