const ExcludedIp = require('../models/ExcludedIp');

const CACHE_TTL = 30000;
let cachedIps = new Set();
let cacheExpiresAt = 0;

function normalizeIp(value) {
  let ip = String(value || '').trim().toLowerCase();
  if (ip.startsWith('::ffff:') && /^::ffff:\d+\.\d+\.\d+\.\d+$/.test(ip)) ip = ip.slice(7);
  if (ip.startsWith('[') && ip.endsWith(']')) ip = ip.slice(1, -1);
  const zoneIndex = ip.indexOf('%');
  if (zoneIndex !== -1) ip = ip.slice(0, zoneIndex);
  return ip;
}

function requestIp(req) {
  return normalizeIp(req.ip || req.socket?.remoteAddress);
}

async function excludedIpSet() {
  if (Date.now() < cacheExpiresAt) return cachedIps;
  const records = await ExcludedIp.find().select('ip').lean();
  cachedIps = new Set(records.map(record => normalizeIp(record.ip)).filter(Boolean));
  cacheExpiresAt = Date.now() + CACHE_TTL;
  return cachedIps;
}

async function isExcludedRequest(req) {
  const ip = requestIp(req);
  if (!ip) return false;
  return (await excludedIpSet()).has(ip);
}

function clearExcludedIpCache() {
  cacheExpiresAt = 0;
}

module.exports = { clearExcludedIpCache, isExcludedRequest, normalizeIp, requestIp };
