#!/usr/bin/env bash
set -Eeuo pipefail

deploy_path="${1:?Deployment path is required}"
release_id="${2:?Release ID is required}"
frontend_port="${3:-3000}"
backend_port="${4:-5000}"

release_path="$deploy_path/releases/$release_id"
current_link="$deploy_path/current"
shared_path="$deploy_path/shared"
previous_release=""

command -v node >/dev/null || { echo "Node.js is required on the deployment server." >&2; exit 1; }
command -v pm2 >/dev/null || { echo "PM2 is required: npm install -g pm2" >&2; exit 1; }
command -v curl >/dev/null || { echo "curl is required on the deployment server." >&2; exit 1; }

test -f "$shared_path/frontend.env" || { echo "Missing $shared_path/frontend.env" >&2; exit 1; }
test -f "$shared_path/backend.env" || { echo "Missing $shared_path/backend.env" >&2; exit 1; }
test -f "$release_path/frontend/server.js" || { echo "Frontend artifact is incomplete." >&2; exit 1; }
test -f "$release_path/backend/server.js" || { echo "Backend artifact is incomplete." >&2; exit 1; }

mkdir -p "$shared_path/uploads"
ln -sfn "$shared_path/frontend.env" "$release_path/frontend/.env"
ln -sfn "$shared_path/backend.env" "$release_path/backend/.env"
rm -rf "$release_path/backend/uploads"
ln -sfn "$shared_path/uploads" "$release_path/backend/uploads"

if [[ -L "$current_link" ]]; then
  previous_release="$(readlink -f "$current_link")"
fi

activate_release() {
  local target="$1"
  ln -sfn "$target" "$deploy_path/current.next"
  mv -Tf "$deploy_path/current.next" "$current_link"
}

start_services() {
  pm2 delete proowrx-frontend >/dev/null 2>&1 || true
  pm2 delete proowrx-backend >/dev/null 2>&1 || true
  PORT="$backend_port" NODE_ENV=production pm2 start "$current_link/backend/server.js" --name proowrx-backend --cwd "$current_link/backend"
  PORT="$frontend_port" HOSTNAME=127.0.0.1 NODE_ENV=production pm2 start "$current_link/frontend/server.js" --name proowrx-frontend --cwd "$current_link/frontend"
  pm2 save
}

activate_release "$release_path"
start_services

healthy=false
for _ in $(seq 1 15); do
  if curl --fail --silent "http://127.0.0.1:$backend_port/api/health" >/dev/null \
    && curl --fail --silent "http://127.0.0.1:$frontend_port" >/dev/null; then
    healthy=true
    break
  fi
  sleep 2
done

if [[ "$healthy" != true ]]; then
  echo "Health checks failed; rolling back." >&2
  if [[ -n "$previous_release" && -d "$previous_release" ]]; then
    activate_release "$previous_release"
    start_services
  fi
  exit 1
fi

find "$deploy_path/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
  | sort -nr \
  | tail -n +6 \
  | cut -d' ' -f2- \
  | xargs -r rm -rf

echo "Deployment $release_id completed successfully."

