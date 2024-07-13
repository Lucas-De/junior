import { VercelPoolClient } from "@vercel/postgres";

export async function doesQuestionAnswerExist(
  id: number,
  client: VercelPoolClient
) {
  const questionAnswer = await client.sql`
    SELECT id FROM transcript_question_answer WHERE id = ${id}
  `;
  return questionAnswer !== null;
}

export async function doesDirectoryExist(id: number, client: VercelPoolClient) {
  const questionAnswer = await client.sql`
      SELECT id FROM bookmark_directory WHERE id = ${id}
    `;
  return questionAnswer !== null;
}

export async function createDirectory(
  name: string,
  transcriptQaId: number,
  client: VercelPoolClient
): Promise<number> {
  const { rows } = await client.sql`
        INSERT INTO bookmark_directory (name, transcript_id) 
          SELECT ${name}, transcript_id 
          FROM transcript_question_answer 
          WHERE id = ${transcriptQaId}
        RETURNING bookmark_directory.id;
    `;

  return rows[0]?.id;
}

export async function createBookmark(
  text: string,
  transcriptQaId: number,
  options: { directoryId?: number; newDirectoryName?: string },
  client: VercelPoolClient
) {
  let directoryId = options.directoryId;
  if (options.newDirectoryName) {
    directoryId = await createDirectory(
      options.newDirectoryName,
      transcriptQaId,
      client
    );
  }

  await client.sql`
  INSERT INTO bookmark (transcript_question_answer_id, bookmark_directory_id, text)
  VALUES (${transcriptQaId}, ${directoryId}, ${text})
`;
}
