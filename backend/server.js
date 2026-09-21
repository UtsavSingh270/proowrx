require('dotenv').config();
const express     = require('express');
const path        = require('path');
const cors        = require('cors');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
const connectDB   = require('./config/db');

const authRoutes    = require('./routes/auth');
const postRoutes    = require('./routes/posts');
const jobRoutes     = require('./routes/jobs');
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');
const meetingRoutes = require('./routes/meetings');
const teamMemberRoutes = require('./routes/teamMembers');
const resourceRoutes = require('./routes/resources');
const worklifeRoutes = require('./routes/worklife');
const auditLogRoutes = require('./routes/auditLogs');
const uploadRoutes  = require('./routes/uploads');
const analyticsRoutes = require('./routes/analytics');

/* ── DB ─────────────────────────────────────── */
connectDB();

/* ── App ────────────────────────────────────── */
const app = express();
const trustProxy = process.env.TRUST_PROXY || 'loopback';
app.set('trust proxy', trustProxy);

/* ── Security / middleware ───────────────────── */
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/* ── Rate limiting ───────────────────────────── */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again in 15 minutes.' },
});

app.use('/api', globalLimiter);
app.use('/api/auth/login', authLimiter);

/* ── Routes ──────────────────────────────────── */
app.use('/api/auth',     authRoutes);
app.use('/api/posts',    postRoutes);
app.use('/api/jobs',     jobRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/team-members', teamMemberRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/worklife', worklifeRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/upload',   uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

/* ── Health check ────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
  });
});

/* ── 404 ──────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

/* ── Error handler ───────────────────────────── */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

/* ── Start ───────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Proowrx API running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
