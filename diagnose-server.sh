#!/bin/bash

# Quick diagnostic script for server

echo "🔍 NFC Medical Server Diagnostics"
echo "=================================="
echo ""

cd /root/nfc-app || exit 1

echo "📋 Docker Images:"
docker images | grep nfc
echo ""

echo "📦 Containers Status:"
docker compose ps -a
echo ""

echo "📝 Backend Logs (last 100 lines):"
docker compose logs backend --tail 100 2>&1 || echo "No backend logs"
echo ""

echo "🔍 Trying to start backend manually..."
docker compose up backend 2>&1 | head -50
