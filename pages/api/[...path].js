import api from '@/server/api';

// Preserve streaming uploads and the existing Node middleware inside Next.js.
export const config = { api: { bodyParser: false, externalResolver: true } };
export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    res.once('finish', resolve);
    res.once('close', resolve);
    api(req, res, reject);
  });
}
