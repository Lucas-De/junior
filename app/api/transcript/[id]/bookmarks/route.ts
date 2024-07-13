import { db, sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { createBookmark } from "./service";
import { BookmarkDirectory } from "@/utils/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface GetBookmarkParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: GetBookmarkParams) {
  const { id: transcriptId } = params;
  const searchParams = req.nextUrl.searchParams;
  const searchQuery = searchParams.get("search") ?? "";
  const likeString = `%${searchQuery}%`;

  const client = await db.connect();
  const { rows } = await client.sql`
         SELECT 
          b.id,
          b.text,
          qa.question, 
          d.name as dir_name, 
          d.id as dir_id
        FROM bookmark b
        LEFT JOIN bookmark_directory d ON d.id = b.bookmark_directory_id
        LEFT JOIN transcript_question_answer qa ON qa.id = b.transcript_question_answer_id
        WHERE qa.transcript_id = ${transcriptId} and b.text ILIKE ${likeString};
    `;

  console.log(rows);

  const directories: Record<number, BookmarkDirectory> = {};
  rows.forEach((row) => {
    if (!directories[row.dir_id]) {
      directories[row.dir_id] = {
        id: row.dir_id,
        name: row.dir_name,
        bookmarks: [],
      };
    }
    directories[row.dir_id].bookmarks.push({
      id: row.id,
      text: row.text,
      question: row.question,
    });
  });

  const directotyList: BookmarkDirectory[] = Object.values(directories);

  return NextResponse.json(directotyList, { status: 200 });
}

/**
 * Creates a bookmark.
 * If directoryId is present in body create bookmark in directory
 * If newDirectoryName is present in body create bookmark + directory
 *
 * Would normally return the created resource but:
 * - its a bit tedious without an ORM
 * - frontend doesnt need it for now
 */
export async function POST(req: NextRequest) {
  //Input Validation
  let body;
  try {
    const schema = z
      .object({
        transcriptQaId: z.number().int(),
        directoryId: z.number().int().optional(),
        newDirectoryName: z.string().optional(),
        text: z.string(),
      })
      .refine(
        (data) => data.directoryId || data.newDirectoryName,
        "Provide a directory id or a new driectory name."
      );
    body = schema.parse(await req.json());
  } catch (e) {
    const issues = e instanceof ZodError ? e.issues : [];
    return NextResponse.json({ issues }, { status: 400 });
  }

  //Business Logic
  const client = await db.connect();
  try {
    client.sql`BEGIN`;
    await createBookmark(
      body.text,
      body.transcriptQaId,
      {
        directoryId: body.directoryId,
        newDirectoryName: body.newDirectoryName,
      },
      client
    );
    client.sql`COMMIT`;
    return NextResponse.json({}, { status: 201 });
  } catch (e) {
    console.log(e);
    client.sql`ROLLBACK`;
    return NextResponse.json({}, { status: 500 });
  }
}
