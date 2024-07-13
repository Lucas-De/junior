import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { prompt } from "@/utils/nlp";

interface GetDirectoriesParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: GetDirectoriesParams) {
  const { id: transcriptId } = params;

  const client = await db.connect();
  const { rows } = await client.sql`
      SELECT b.text
      FROM bookmark b
      LEFT JOIN transcript_question_answer qa ON qa.id = b.transcript_question_answer_id
      WHERE qa.transcript_id = ${transcriptId} 
    `;

  const bookmarkTexts = JSON.stringify(rows.map((row) => row.text));
  const summary = await prompt(
    `Summarize the following bookmarks in ~100 chars: ${bookmarkTexts}`
  );

  return NextResponse.json({ summary }, { status: 200 });
}
