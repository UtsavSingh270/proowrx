import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000';

function getTargetUrl(request) {
  const incomingUrl = new URL(request.url);
  const baseUrl = BACKEND_URL.endsWith('/') ? BACKEND_URL : `${BACKEND_URL}/`;
  return new URL(incomingUrl.pathname + incomingUrl.search, baseUrl);
}

async function proxyRequest(request) {
  const targetUrl = getTargetUrl(request);
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!['host', 'connection', 'content-length'].includes(lowerKey)) {
      headers.set(key, value);
    }
  });

  const method = request.method;
  const body = method !== 'GET' && method !== 'HEAD' ? await request.arrayBuffer() : undefined;

  const response = await fetch(targetUrl, {
    method,
    headers,
    body,
    redirect: 'manual',
  });

  const responseBody = await response.arrayBuffer();
  const responseHeaders = new Headers();

  response.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(lowerKey)) {
      responseHeaders.set(key, value);
    }
  });

  return new NextResponse(responseBody, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request) {
  return proxyRequest(request);
}

export async function POST(request) {
  return proxyRequest(request);
}

export async function PUT(request) {
  return proxyRequest(request);
}

export async function PATCH(request) {
  return proxyRequest(request);
}

export async function DELETE(request) {
  return proxyRequest(request);
}

export async function OPTIONS(request) {
  return proxyRequest(request);
}
