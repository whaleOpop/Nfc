# Quick Start Guide

This guide helps you get the NFC Medical App running locally and deploy it to production.

## Local Development

### Prerequisites

- Docker and Docker Compose v2 installed
- Git

### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Nfc
```

2. **Create environment file**
```bash
cp .env.example .env
# Edit .env with your preferred settings
```

3. **Start all services**
```bash
docker compose up -d --build
```

4. **Check status**
```bash
docker compose ps
```

5. **Access the application**
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000
- Nginx (reverse proxy): http://localhost:80
- Admin Panel: http://localhost:8000/admin

6. **View logs**
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f web
```

### Useful Commands

```bash
# Stop all services
docker compose down

# Rebuild specific service
docker compose up -d --build backend

# Run Django migrations
docker compose exec backend python manage.py migrate

# Create superuser
docker compose exec backend python manage.py createsuperuser

# Collect static files
docker compose exec backend python manage.py collectstatic --noinput

# Access backend shell
docker compose exec backend python manage.py shell

# Access database
docker compose exec db psql -U nfc_user -d nfc_medical
```

## Production Deployment

### Prerequisites

1. GitHub repository
2. Remote server with Docker
3. Domain name (optional but recommended)

### Quick Setup

1. **Configure GitHub Secrets** (see CICD_SETUP.md for full list)

Required secrets:
```
SSH_PRIVATE_KEY
SERVER_HOST
SERVER_USER
SERVER_PATH
SECRET_KEY
POSTGRES_PASSWORD
REDIS_PASSWORD
VITE_API_URL
```

2. **Prepare your server**
```bash
# On your server
mkdir -p /root/nfc-medical-app
cd /root/nfc-medical-app

# Install Docker (if needed)
curl -fsSL https://get.docker.com | sh
```

3. **Push to main branch**
```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

4. **Monitor deployment**
- Go to GitHub → Actions tab
- Watch the workflow execution
- Check logs for any errors

5. **Verify deployment**
```bash
# SSH to your server
ssh user@your-server

# Check running containers
docker compose ps

# View logs
docker compose logs backend
```

## Workflows

### Backend Changes
When you modify files in `backend/`, the Backend GHCR Deploy workflow automatically:
1. Builds a new Docker image
2. Pushes to GitHub Container Registry
3. Deploys to your server
4. Runs migrations
5. Collects static files
6. Performs health check

### Frontend Changes
When you modify files in `web/`, the Web GHCR Deploy workflow automatically:
1. Builds a new Docker image with Vite
2. Pushes to GitHub Container Registry
3. Deploys to your server
4. Performs health check

## Troubleshooting

### Port Conflicts
If ports 80, 8000, 5432, or 6379 are already in use:

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:8000"  # Change 8000 to 8080
```

### Database Connection Issues
```bash
# Reset database
docker compose down -v
docker compose up -d
```

### Build Failures
```bash
# Clean rebuild
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

## Project Structure

```
Nfc/
├── backend/              # Django backend
│   ├── config/          # Django settings
│   ├── apps/            # Django apps
│   └── Dockerfile       # Backend Docker config
├── web/                 # React frontend
│   ├── src/            # Source code
│   ├── public/         # Static files
│   └── Dockerfile      # Frontend Docker config
├── mobile/             # Flutter mobile app
│   ├── android/
│   └── ios/
├── docker/             # Docker configs
│   └── nginx/         # Nginx configuration
├── .github/
│   └── workflows/     # CI/CD workflows
├── docker-compose.yml  # Service orchestration
└── .env               # Environment variables
```

## Development Workflow

1. **Create feature branch**
```bash
git checkout -b feature/your-feature
```

2. **Make changes**
```bash
# Edit files
# Test locally with docker compose
docker compose up -d --build
```

3. **Commit and push**
```bash
git add .
git commit -m "Add feature"
git push origin feature/your-feature
```

4. **Create Pull Request**
- Go to GitHub
- Create PR from feature branch to main
- Review and merge

5. **Automatic deployment**
- After merge to main, workflows run automatically
- Monitor in Actions tab

## Monitoring

### Health Checks

Backend health endpoint:
```bash
curl http://localhost:8000/api/health/
```

### Logs

```bash
# Real-time logs
docker compose logs -f

# Last 100 lines
docker compose logs --tail=100

# Specific service
docker compose logs -f backend
```

### Resource Usage

```bash
docker stats
```

## Next Steps

- [ ] Set up domain name and SSL certificate
- [ ] Configure backup strategy
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Configure CI/CD for mobile apps
- [ ] Add automated testing to workflows
- [ ] Set up staging environment

## Getting Help

- Check [CICD_SETUP.md](./CICD_SETUP.md) for detailed CI/CD configuration
- Check [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for local dev guide
- Review Docker logs for errors
- Check GitHub Actions logs for deployment issues

## Common Tasks

### Update Dependencies

Backend:
```bash
docker compose exec backend pip install -r requirements.txt
docker compose restart backend
```

Frontend:
```bash
docker compose exec web npm install
docker compose restart web
```

### Database Backup

```bash
docker compose exec db pg_dump -U nfc_user nfc_medical > backup.sql
```

### Database Restore

```bash
docker compose exec -T db psql -U nfc_user nfc_medical < backup.sql
```

### Clear Redis Cache

```bash
docker compose exec redis redis-cli -a changeme FLUSHALL
```
