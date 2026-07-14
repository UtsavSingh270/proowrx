# Proowrx Backend API

Express.js + MongoDB REST API for the Proowrx website.

## Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Set up MongoDB
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a database user and whitelist your IP
- Copy the connection string into `backend/.env` → `MONGODB_URI`

### 3. Configure environment
Edit `backend/.env`:
```
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/proowrx
JWT_SECRET=generate_a_random_64_char_string_here
ADMIN_PASSWORD=proowrx@2025
```

### 4. Run
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts on `http://localhost:5000`

---

## API Reference

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | `{ password }` → `{ token }` |
| GET  | `/api/auth/verify` | Bearer | Check token validity |

### Blog Posts
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET  | `/api/posts` | — | All published posts (no htmlContent) |
| GET  | `/api/posts/:id?view=1` | — | Single post + increment view |
| POST | `/api/posts/:id/like` | — | Toggle like `{ deviceId }` |
| GET  | `/api/posts/admin/all` | Bearer | All posts any status |
| GET  | `/api/posts/admin/:id` | Bearer | Full post for editing |
| POST | `/api/posts` | Bearer | Create post |
| PUT  | `/api/posts/:id` | Bearer | Update post |
| PATCH| `/api/posts/:id/status` | Bearer | Change status `{ status }` |
| DELETE | `/api/posts/:id` | Bearer | Delete post |

### Jobs
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET  | `/api/jobs` | — | Active jobs |
| GET  | `/api/jobs/admin/all` | Bearer | All jobs |
| POST | `/api/jobs` | Bearer | Create job |
| PUT  | `/api/jobs/:id` | Bearer | Update job |
| PATCH| `/api/jobs/:id/status` | Bearer | Toggle active/inactive |
| DELETE | `/api/jobs/:id` | Bearer | Delete job |

### Contact
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/contact` | — | Submit enquiry (saved to DB + email) |
| GET  | `/api/contact` | Bearer | List all enquiries |
| PATCH| `/api/contact/:id/read` | Bearer | Mark as read |
| DELETE | `/api/contact/:id` | Bearer | Delete enquiry |

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server status + uptime |

---

## Production Deployment

### Environment variables to set on server
```
NODE_ENV=production
MONGODB_URI=<atlas_uri>
JWT_SECRET=<random_64_chars>
ADMIN_PASSWORD=<secure_password>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<gmail>
SMTP_PASS=<app_password>
EMAIL_TO=support@proowrx.com
SUPPORT_EMAIL=support@proowrx.com
MEETING_CC_1=
MEETING_CC_2=
MEETING_CC_3=
FRONTEND_URL=https://proowrx.com
```

### Recommended: deploy to Railway / Render / Fly.io
All support Node.js + free MongoDB Atlas tier.
