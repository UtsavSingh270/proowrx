# Self-hosted production deployment

The production stack runs the standalone Next.js server behind Nginx. Nginx terminates TLS, redirects HTTP to HTTPS, rate-limits API traffic, caches immutable Next.js assets, and forwards the original client and protocol headers to the app.

## First deployment

1. Install Docker Engine with the Docker Compose plugin on the server.
2. Point the `proowrx.com` and `www.proowrx.com` DNS records to the server.
3. Clone the repository and create `.env.production` from `.env.example`. Use production credentials and never commit that file.
4. Allow inbound TCP ports 80 and 443 in the server firewall.
5. Run:

   ```bash
   export LETSENCRYPT_EMAIL=admin@proowrx.com
   bash deploy/setup-server.sh
   ```

The script starts the HTTP configuration, obtains the first Let's Encrypt certificate through the webroot challenge, then recreates Nginx with the HTTPS configuration.

## Updates

After pulling an approved release, rebuild and restart the app while retaining the HTTPS configuration:

```bash
NGINX_CONFIG=./deploy/nginx.https.conf docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

Verify the public health endpoint with `curl --fail https://proowrx.com/healthz`.

## Certificate renewal

Run the renewal script monthly from root's crontab or a systemd timer:

```cron
17 3 1 * * cd /opt/proowrx && bash deploy/renew-certificates.sh >> /var/log/proowrx-certbot.log 2>&1
```

Replace `/opt/proowrx` with the repository location on the server. Docker volumes retain certificates and ACME challenge data across container updates.

## Vercel

Vercel continues to use its managed edge proxy and TLS. These Docker and Nginx files are only used by the future self-hosted server and do not change the current Vercel deployment.
