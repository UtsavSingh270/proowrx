#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

COMPOSE=(docker compose --env-file .env.production -f docker-compose.production.yml)
"${COMPOSE[@]}" run --rm certbot renew --webroot --webroot-path /var/www/certbot
env NGINX_CONFIG=./deploy/nginx.https.conf "${COMPOSE[@]}" exec nginx nginx -s reload
