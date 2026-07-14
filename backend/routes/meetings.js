const express    = require('express');
const nodemailer = require('nodemailer');
const Meeting    = require('../models/Meeting');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fmtDisplayTime(time) {
  const [hour, minute] = String(time).split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute || 0).padStart(2, '0')} ${suffix}`;
}

function meetingDetailsTable(meeting, heading) {
  const rows = [
    ['Meeting With', `${meeting.person}${meeting.personEmail ? ` (${meeting.personEmail})` : ''}`],
    ['Date', meeting.date],
    ['Time', `${fmtDisplayTime(meeting.time)} (${meeting.timezone})`],
    ['Booked By', meeting.name],
    ['User Email', meeting.email],
    ['Phone', meeting.phone || '-'],
    ['Reason', meeting.reason || '-'],
  ];

  return `
    <h2>${escapeHtml(heading)}</h2>
    <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
      ${rows.map(([label, value], index) => `
        <tr${index % 2 ? ' style="background:#f8f9fc"' : ''}>
          <td style="padding:8px;font-weight:bold;color:#374a6e;width:160px">${escapeHtml(label)}</td>
          <td style="padding:8px">${escapeHtml(value)}</td>
        </tr>
      `).join('')}
    </table>
  `;
}

/* ── Public ─────────────────────────────────────────────────── */

// GET /api/meetings/booked?person=&date=  — booked time slots for a person on a date
router.get('/booked', async (req, res) => {
  try {
    const { person, date } = req.query;
    if (!person || !date) return res.status(400).json({ error: 'person and date are required' });
    const meetings = await Meeting.find({ person, date, status: { $ne: 'cancelled' } }).select('time');
    res.json(meetings.map(m => m.time));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/meetings — book a meeting
router.post('/', async (req, res) => {
  try {
    const { person, personEmail, date, time, timezone, name, email, phone, reason } = req.body;
    if (!person || !date || !time || !name || !email) {
      return res.status(400).json({ error: 'person, date, time, name and email are required' });
    }

    const clash = await Meeting.findOne({ person, date, time, status: { $ne: 'cancelled' } });
    if (clash) return res.status(409).json({ error: 'That time slot has just been booked. Please pick another.' });

    const meeting = await Meeting.create({
      person, personEmail, date, time,
      timezone: timezone || 'Australia/Sydney',
      name, email, phone, reason,
    });

    try {
      const transporter = createTransporter();
      const supportEmail = process.env.SUPPORT_EMAIL || process.env.EMAIL_TO;
      const cc = [
        process.env.MEETING_CC_1,
        process.env.MEETING_CC_2,
        process.env.MEETING_CC_3,
      ].filter(Boolean);

      await Promise.all([
        transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          cc,
          subject: `Your Proowrx meeting with ${person} is confirmed`,
          html: `
            <p>Hello ${escapeHtml(name)},</p>
            <p>Your meeting has been booked. The details are below.</p>
            ${meetingDetailsTable(meeting, 'Meeting Confirmation')}
          `,
        }),
        transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: [supportEmail, personEmail].filter(Boolean).join(','),
          cc,
          subject: `New meeting booked with ${person} - Proowrx`,
          html: meetingDetailsTable(meeting, 'New Meeting Request'),
        }),
      ]);
    } catch (mailErr) {
      console.error('Meeting email send error:', mailErr.message);
    }

    res.status(201).json(meeting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ── Admin ──────────────────────────────────────────────────── */

// GET /api/meetings — list all meetings
router.get('/', requireAdmin, async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/meetings/:id/status
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json(meeting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/meetings/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
