import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

interface GetDirectoriesParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: GetDirectoriesParams) {
  const { id: transcriptId } = params;

  const client = await db.connect();
  const { rows } = await client.sql`
          SELECT id, name
          FROM bookmark_directory d
          WHERE transcript_id = ${transcriptId};
      `;

  return NextResponse.json(rows, { status: 200 });
}
