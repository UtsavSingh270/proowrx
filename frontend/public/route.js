import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET(request) {
  return NextResponse.redirect(new URL('/file.svg', request.url), 302);
}
