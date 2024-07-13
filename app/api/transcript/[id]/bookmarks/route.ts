import { db, sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { doesBookmarkDirectoryExist, doesQuestionAnswerExist } from "./service";
import { BookmarkDirectory } from "@/utils/types";

export async function POST(req: NextRequest) {
  //input validation
  let body;
  try {
    const schema = z.object({
      transcriptQaId: z.number().int(),
      directoryId: z.number().int(),
      quote: z.string(),
    });
    body = schema.parse(await req.json());
  } catch (e) {
    const issues = e instanceof ZodError ? e.issues : [];
    return NextResponse.json({ issues }, { status: 400 });
  }

  const client = await db.connect();
  const qaExists = await doesQuestionAnswerExist(body.transcriptQaId, client);
  if (!qaExists) {
    return NextResponse.json({ error: "QA not found" }, { status: 404 });
  }
  const dirExists = await doesBookmarkDirectoryExist(body.directoryId, client);
  if (!dirExists) {
    return NextResponse.json({ error: "directory not found" }, { status: 404 });
  }

  await client.sql`
        INSERT INTO bookmarks (transcript_question_answer_id, bookmark_directory_id, quote)
        VALUES (${body.transcriptQaId}, ${(body.directoryId, body.quote)})
      `;

  return NextResponse.json({ success: true }, { status: 20 });
}

interface GetBookmarkParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: GetBookmarkParams) {
  const { id: transcriptId } = params;

  const client = await db.connect();
  const { rows } = await client.sql`
         SELECT 
          b.id,
          b.quote,
          qa.question, 
          d.name as dir_name, 
          d.id as dir_id
        FROM bookmark b
        LEFT JOIN bookmark_directory d ON d.id = b.bookmark_directory_id
        LEFT JOIN transcript_question_answer qa ON qa.id = b.transcript_question_answer_id
        WHERE qa.transcript_id = ${transcriptId}
    `;

  console.log(rows);

  const directories: Record<number, BookmarkDirectory> = {};
  rows.forEach((row) => {
    console.log(row);
    if (!directories[row.dir_id]) {
      directories[row.dir_id] = {
        id: row.dir_id,
        name: row.dir_name,
        bookmarks: [{ id: row.id, quote: row.quote, question: row.question }],
      };
    }
  });

  const directotyList: BookmarkDirectory[] = Object.values(directories);

  return NextResponse.json(directotyList, { status: 200 });
}
