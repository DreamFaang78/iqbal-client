import { NextResponse } from 'next/server';

const INDEXNOW_KEY = 'hommed-indexnow-2026';
const HOST = 'www.hommed.org';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

// Pings IndexNow (Bing, Yandex, etc.) so changed pages get crawled instantly.
// POST { url: string } or { urls: string[] }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const urls: string[] = body.urls || (body.url ? [body.url] : []);

    if (!urls.length) {
      return NextResponse.json({ error: 'No URL(s) provided' }, { status: 400 });
    }

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls,
      }),
    });

    return NextResponse.json({ submitted: urls.length, status: response.status });
  } catch (err) {
    console.error('IndexNow ping error:', err);
    return NextResponse.json({ error: 'Failed to ping IndexNow' }, { status: 500 });
  }
}
