const { normalizeSeo, normalizePlacements } = require('./seo');
function normalizeCaseStudy(body) {
  const data = {};
  for (const key of ['title', 'clientName', 'industry', 'service', 'duration', 'summary', 'image', 'challenge', 'approach', 'results', 'testimonial', 'testimonialBy']) {
    data[key] = String(body[key] || '').trim();
  }
  if (!data.title) throw new Error('A case study title is required');
  data.status = body.status || 'draft';
  if (!['draft', 'published', 'paused'].includes(data.status)) throw new Error('Invalid case study status');
  if (data.status === 'published' && ['summary', 'challenge', 'approach', 'results'].some(key => !data[key])) throw new Error('Published case studies need a summary, challenge, approach and results');
  if (body.metrics != null && (!Array.isArray(body.metrics) || body.metrics.length > 6)) throw new Error('Use up to six outcome metrics');
  data.metrics = (body.metrics || []).map(item => ({ label: String(item.label || '').trim(), value: String(item.value || '').trim() })).filter(item => item.label || item.value);
  if (data.metrics.some(item => !item.label || !item.value)) throw new Error('Each metric needs a label and a value');
  if ('displayPages' in body) data.displayPages = normalizePlacements(body.displayPages);
  if ('seo' in body) data.seo = normalizeSeo(body.seo);
  return data;
}
module.exports = { normalizeCaseStudy };
