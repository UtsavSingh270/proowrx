function publicPostFilter(now = new Date()) {
  return { $or: [{ status: 'published' }, { status: 'scheduled', scheduledAt: { $lte: now } }] };
}
module.exports = { publicPostFilter };
