import { NextRequest, NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

export async function POST(req: NextRequest) {
  const client = await db.connect();

  const { quote, id } = await req.json();

  if (id) {
    const transcript = await client.sql`
      SELECT * FROM transcript WHERE id = ${id}
    `;

    if (transcript) {
      await client.sql`
        INSERT INTO bookmarks (transcript_id, quote)
        VALUES (${id}, ${quote})
      `;

      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Transcript not found' },
        { status: 404 }
      );
    }
  } else {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
}
