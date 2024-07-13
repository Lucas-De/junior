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

export async function doesBookmarkDirectoryExist(
  id: number,
  client: VercelPoolClient
) {
  const questionAnswer = await client.sql`
      SELECT id FROM bookmark_directory WHERE id = ${id}
    `;
  return questionAnswer !== null;
}
