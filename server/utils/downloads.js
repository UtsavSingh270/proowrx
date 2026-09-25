const jwt = require('jsonwebtoken');
function downloadDetails(body) {
  const name = String(body.name || '').trim().slice(0, 160);
  const email = String(body.email || '').trim().toLowerCase().slice(0, 254);
  const phone = String(body.phone || '').trim().slice(0, 40);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.replace(/\D/g, '').length < 7) throw new Error('Enter your name, a valid email and contact number');
  return { name, email, phone };
}
function createDownloadToken(resourceId) {
  return jwt.sign({ resourceId: String(resourceId), purpose: 'resource-download' }, process.env.JWT_SECRET, { expiresIn: '10m', audience: 'resource-download' });
}
function verifyDownloadToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET, { audience: 'resource-download', algorithms: ['HS256'] });
  if (payload.purpose !== 'resource-download' || !payload.resourceId) throw new Error('Invalid download token');
  return payload.resourceId;
}
module.exports = { downloadDetails, createDownloadToken, verifyDownloadToken };
