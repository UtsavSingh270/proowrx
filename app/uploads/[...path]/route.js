import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
const types = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm' };

export async function GET(request, { params }) {
  const segments = (await params).path;
  const base = path.resolve(process.cwd(), 'server/uploads');
  const target = path.resolve(base, ...segments);
  if (!target.startsWith(base + path.sep) || segments.some(segment => segment.startsWith('.') || segment.includes('\\'))) return new Response('Not found', { status: 404 });
  try {
    const body = await readFile(target);
    return new Response(body, { headers: { 'Content-Type': types[path.extname(target).toLowerCase()] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=3600' } });
  } catch { return new Response('Not found', { status: 404 }); }
}
