import { NextResponse } from 'next/server';
import { client } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    try {
      // Update opened_at if it's the first time, or update last_opened if we tracked that.
      // For now, let's just set opened_at if it's null.
      await client.query(
        `UPDATE emails SET opened_at = COALESCE(opened_at, NOW()) WHERE id = $1`,
        [id]
      );
    } catch (error) {
      console.error("Error tracking email open:", error);
    }
  }

  // Return 1x1 transparent GIF
  const pixel = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );

  return new NextResponse(pixel, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
