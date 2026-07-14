# GitLab CI/CD Setup

The pipeline validates, builds, and deploys both applications:

- Frontend: Next.js standalone server on port `3000` by default.
- Backend: Express API on port `5000` by default.
- Production deploys run automatically from the default branch.
- Releases are uploaded over SSH, switched atomically, checked, and rolled back on failure.
- The five newest releases are retained.

## GitLab CI/CD variables

Create these under **Settings > CI/CD > Variables**. Mark production secrets as **Protected**.

| Variable | Type | Required | Example |
| --- | --- | --- | --- |
| `DEPLOY_HOST` | Variable | Yes | `203.0.113.10` |
| `DEPLOY_USER` | Variable | Yes | `deploy` |
| `DEPLOY_PATH` | Variable | Yes | `/var/www/proowrx` |
| `SSH_PRIVATE_KEY` | File | Yes | Private ED25519 deployment key, ending with a newline |
| `SSH_KNOWN_HOSTS` | File | Yes | Trusted server host-key output |
| `NEXT_PUBLIC_API_URL` | Variable | Yes | `https://api.proowrx.com` |
| `PRODUCTION_URL` | Variable | Recommended | `https://proowrx.com` |
| `FRONTEND_PORT` | Variable | Optional | `3000` |
| `BACKEND_PORT` | Variable | Optional | `5000` |

Generate `SSH_KNOWN_HOSTS` from a trusted machine, not inside CI:

```bash
ssh-keyscan your-server.example.com
```

## Production server prerequisites

Install Node.js 22, PM2, curl, and an Nginx or equivalent reverse proxy:

```bash
npm install --global pm2
sudo mkdir -p /var/www/proowrx/shared/uploads
sudo chown -R deploy:deploy /var/www/proowrx
```

Create `/var/www/proowrx/shared/frontend.env`:

```dotenv
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.proowrx.com
API_URL=http://127.0.0.1:5000
NEXT_PUBLIC_SITE_URL=https://proowrx.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

Create `/var/www/proowrx/shared/backend.env` using the production values documented in `backend/README.md`. Never commit either production file.

Configure Nginx to proxy the public website to `127.0.0.1:3000` and the API domain (or `/api`) to `127.0.0.1:5000`. Enable PM2 startup persistence once for the deployment user:

```bash
pm2 startup
pm2 save
```

## Important repository cleanup

`backend/.env` and `backend/node_modules` were previously tracked by Git. Before production deployment:

1. Rotate every credential contained in `backend/.env`.
2. Remove the tracked environment file and dependencies from Git history/index.
3. Keep the backend ignore rules in `backend/.gitignore`.

Do not rely on deleting the local files alone; already-committed secrets remain in Git history until it is rewritten.
