#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

: "${LETSENCRYPT_EMAIL:?Set LETSENCRYPT_EMAIL before running this script}"
DOMAIN="${DOMAIN:-proowrx.com}"
COMPOSE=(docker compose --env-file .env.production -f docker-compose.production.yml)

test -f .env.production
docker compose version >/dev/null

env NGINX_CONFIG=./deploy/nginx.conf "${COMPOSE[@]}" up -d --build app nginx
"${COMPOSE[@]}" run --rm certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --email "$LETSENCRYPT_EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

env NGINX_CONFIG=./deploy/nginx.https.conf "${COMPOSE[@]}" up -d --force-recreate nginx
"${COMPOSE[@]}" exec nginx nginx -t

echo "Production services are running at https://$DOMAIN"
