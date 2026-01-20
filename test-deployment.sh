#!/bin/bash

# Test deployment script to verify Docker setup locally

set -e

echo "🧪 Testing NFC Medical Deployment"
echo "=================================="
echo ""

# Check Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running"
  exit 1
fi
echo "✅ Docker is running"

# Check docker-compose.yml exists
if [ ! -f docker-compose.yml ]; then
  echo "❌ docker-compose.yml not found"
  exit 1
fi
echo "✅ docker-compose.yml found"

# Create test .env file
echo "📝 Creating test .env file..."
cat > .env << EOF
IMAGE_TAG=latest
GITHUB_REPOSITORY_OWNER=local

# Backend secrets
SECRET_KEY=test-secret-key-insecure-do-not-use-in-production
DEBUG=True
ALLOWED_HOSTS=*

# Database (PostgreSQL)
POSTGRES_DB=nfc_medical
POSTGRES_USER=nfc_user
POSTGRES_PASSWORD=testpass123
DB_PASSWORD=testpass123

# Redis
REDIS_PASSWORD=testredis123

# Celery
CELERY_BROKER_URL=redis://:testredis123@redis:6379/0
CELERY_RESULT_BACKEND=redis://:testredis123@redis:6379/0
EOF

echo "✅ Test .env file created"
echo ""

# Show non-sensitive variables
echo "📋 Environment variables:"
cat .env | grep -v PASSWORD | grep -v SECRET_KEY
echo ""

# Stop any running containers
echo "🛑 Stopping any running containers..."
docker compose down || true
echo ""

# Start database and redis
echo "🐘 Starting PostgreSQL..."
docker compose up -d db

echo "⏳ Waiting for PostgreSQL to be ready..."
max_wait=30
counter=0
until docker compose exec -T db pg_isready -U nfc_user > /dev/null 2>&1; do
  counter=$((counter + 1))
  if [ $counter -gt $max_wait ]; then
    echo "❌ PostgreSQL failed to start"
    docker compose logs db
    exit 1
  fi
  echo "  Waiting... ($counter/$max_wait)"
  sleep 2
done
echo "✅ PostgreSQL is ready"
echo ""

echo "📦 Starting Redis..."
docker compose up -d redis
sleep 5
echo "✅ Redis started"
echo ""

# Try to start backend
echo "🚀 Starting backend..."
if docker compose up -d backend --build; then
  echo "✅ Backend container started"
else
  echo "❌ Failed to start backend"
  docker compose logs backend
  exit 1
fi

echo "⏳ Waiting for backend to be healthy..."
max_wait=120
counter=0

while [ $counter -lt $max_wait ]; do
  counter=$((counter + 1))

  if docker inspect nfc_backend >/dev/null 2>&1; then
    status=$(docker inspect -f '{{.State.Status}}' nfc_backend 2>/dev/null || echo "unknown")

    if [ "$status" = "running" ]; then
      echo "✅ Backend container is running"
      break
    elif [ "$status" = "exited" ] || [ "$status" = "dead" ]; then
      echo "❌ Backend container crashed"
      echo ""
      echo "Logs:"
      docker compose logs backend
      exit 1
    else
      echo "  Status: $status ($counter/$max_wait)"
    fi
  else
    echo "  Creating... ($counter/$max_wait)"
  fi

  sleep 2
done

if [ $counter -ge $max_wait ]; then
  echo "❌ Timeout waiting for backend"
  docker compose logs backend
  exit 1
fi

echo ""
echo "⏳ Waiting for Django to initialize..."
sleep 15

echo "🔍 Checking manage.py..."
if docker compose exec -T backend test -f /app/manage.py; then
  echo "✅ manage.py found"
else
  echo "❌ manage.py not found"
  docker compose exec -T backend ls -la /app/
  exit 1
fi

echo ""
echo "📊 Running migrations..."
if docker compose exec -T backend python manage.py migrate --noinput; then
  echo "✅ Migrations completed"
else
  echo "❌ Migrations failed"
  docker compose logs backend --tail 50
  exit 1
fi

echo ""
echo "📋 Container status:"
docker compose ps

echo ""
echo "📝 Backend logs:"
docker compose logs backend --tail 30

echo ""
echo "✅ Deployment test completed successfully!"
echo ""
echo "To test the API:"
echo "  curl http://localhost:8000/api/health/"
echo ""
echo "To stop:"
echo "  docker compose down"
