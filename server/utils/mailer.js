const nodemailer = require('nodemailer');
const { getNotificationCc } = require('./notificationSettings');

const DEFAULT_SUPPORT_EMAIL = 'support@proowrx.com';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getSupportEmail() {
  return String(process.env.SUPPORT_EMAIL || DEFAULT_SUPPORT_EMAIL).trim() || DEFAULT_SUPPORT_EMAIL;
}

function getFromAddress() {
  return String(process.env.SMTP_FROM || process.env.EMAIL_FROM || `Proowrx <${getSupportEmail()}>`).trim();
}

function parseBoolean(value, fallback = false) {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  return fallback;
}

function smtpIsConfigured() {
  const host = String(process.env.SMTP_HOST || '').trim();
  const user = String(process.env.SMTP_USER || '').trim();
  const pass = String(process.env.SMTP_PASS || '').trim();
  return Boolean(host && user && pass && user !== 'your@gmail.com' && pass !== 'your_app_password');
}

function createSmtpTransporter() {
  if (!smtpIsConfigured()) return null;

  const port = Number(process.env.SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: parseBoolean(process.env.SMTP_SECURE, port === 465),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

function enquiryRows(entry) {
  return [
    ['Name', entry.name],
    ['Email', entry.email],
    ['Phone', entry.phone],
    ['Company', entry.company],
    ['Interest', entry.interest],
    ['Message', entry.message],
    ['Source', entry.source || 'contact_page'],
    ['Page', entry.sourcePage],
    ['Page title', entry.sourceTitle],
  ].filter(([, value]) => String(value || '').trim());
}

function enquiryTable(entry) {
  return `
    <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">
      ${enquiryRows(entry).map(([label, value], index) => `
        <tr${index % 2 ? ' style="background:#f7f9fc"' : ''}>
          <td style="padding:10px 12px;font-weight:700;color:#173f78;width:150px;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;color:#334a6e;white-space:pre-wrap">${label === 'Email' ? `<a href="mailto:${escapeHtml(value)}" style="color:#173f78">${escapeHtml(value)}</a>` : escapeHtml(value)}</td>
        </tr>
      `).join('')}
    </table>
  `;
}

function acknowledgementHtml(entry) {
  const firstName = escapeHtml(String(entry.name || '').trim().split(/\s+/)[0] || 'there');
  return `
    <div style="margin:0;background:#f5f8fc;padding:32px 16px;font-family:Arial,sans-serif;color:#243b61">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #dbe3ef;border-radius:16px;overflow:hidden">
        <div style="padding:24px 28px;background:#0b2245">
          <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-.02em">Proowrx</div>
          <div style="margin-top:4px;color:#ffd36a;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">Knowledge Centre</div>
        </div>
        <div style="padding:30px 28px">
          <h1 style="margin:0 0 16px;color:#0b2245;font-size:26px;line-height:1.2">Thank you for contacting Proowrx</h1>
          <p style="margin:0 0 14px;font-size:16px;line-height:1.65">Hello ${firstName},</p>
          <p style="margin:0 0 14px;font-size:16px;line-height:1.65">We have received your enquiry and our team will review the details you shared.</p>
          <p style="margin:0 0 22px;font-size:16px;line-height:1.65"><strong>We will respond within 72 hours.</strong></p>
          <div style="margin:0 0 24px;padding:16px 18px;background:#f7f9fc;border-left:4px solid #ffd36a;border-radius:8px;font-size:14px;line-height:1.55;color:#405475">If you need to add anything before we reply, email us at <a href="mailto:${escapeHtml(getSupportEmail())}" style="color:#173f78;font-weight:700">${escapeHtml(getSupportEmail())}</a>.</div>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#71809a">Kind regards,<br /><strong style="color:#173f78">The Proowrx team</strong></p>
        </div>
      </div>
    </div>
  `;
}

async function sendContactNotifications(entry) {
  const transporter = createSmtpTransporter();
  if (!transporter) return { sent: false, skipped: true, reason: 'SMTP is not configured' };

  const supportEmail = getSupportEmail();
  const cc = await getNotificationCc();
  const from = getFromAddress();
  const name = String(entry.name || 'Website visitor').trim();
  const subject = `New enquiry from ${name} - Proowrx`;
  const internalText = enquiryRows(entry).map(([label, value]) => `${label}: ${value}`).join('\n');

  const results = await Promise.allSettled([
    transporter.sendMail({
      from,
      to: supportEmail,
      cc,
      replyTo: entry.email,
      subject,
      text: `A new Proowrx website enquiry was received.\n\n${internalText}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#243b61">
          <h2 style="color:#0b2245;margin-bottom:8px">New Proowrx website enquiry</h2>
          <p style="color:#71809a">A new enquiry has been submitted through the website.</p>
          ${enquiryTable(entry)}
        </div>
      `,
    }),
    transporter.sendMail({
      from,
      to: entry.email,
      replyTo: supportEmail,
      subject: 'Thanks for contacting Proowrx',
      text: `Hello ${name},\n\nWe have received your enquiry and our team will review the details you shared.\n\nWe will respond within 72 hours.\n\nKind regards,\nThe Proowrx team`,
      html: acknowledgementHtml(entry),
    }),
  ]);

  const failures = results.filter(result => result.status === 'rejected');
  if (failures.length) {
    throw new Error(failures.map(result => result.reason?.message || 'Email delivery failed').join('; '));
  }

  return { sent: true, skipped: false, ccCount: cc.length };
}

module.exports = {
  createSmtpTransporter,
  getFromAddress,
  getSupportEmail,
  sendContactNotifications,
  smtpIsConfigured,
};
