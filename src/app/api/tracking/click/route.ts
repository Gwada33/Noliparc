import { NextResponse } from 'next/server';
import { client } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  if (id) {
    try {
      await client.query(
        `UPDATE emails SET clicked_at = NOW(), click_count = click_count + 1 WHERE id = $1`,
        [id]
      );
    } catch (error) {
      console.error("Error tracking email click:", error);
    }
  }

  return NextResponse.redirect(url);
}
