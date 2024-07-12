import { NextRequest, NextResponse } from 'next/server';
import { db, sql } from '@vercel/postgres';
import { faker } from '@faker-js/faker';
import { Transcript } from '@/utils/types';

const seedDb = async ({ reset = false }: { reset?: boolean }) => {
  console.log('Creating tables');

  if (reset) {
    console.log('Resetting database');
    await sql`DROP TABLE IF EXISTS bookmark_transcript_question_answer`;
    await sql`DROP TABLE IF EXISTS transcript_question_answer`;
    await sql`DROP TABLE IF EXISTS transcript`;
    await sql`DROP TABLE IF EXISTS bookmark`;

    // Create tables
    await sql`
      CREATE TABLE transcript (
        id SERIAL PRIMARY KEY,
        interview_name TEXT
      );`;

    await sql`
      CREATE TABLE transcript_question_answer (
        id SERIAL PRIMARY KEY,
        transcript_id INTEGER,
        question TEXT,
        answer TEXT,
        FOREIGN KEY(transcript_id) REFERENCES transcript(id) ON DELETE CASCADE
      );`;

    await sql`
      CREATE TABLE bookmark (
        id SERIAL PRIMARY KEY,
        name TEXT
      );`;

    await sql`
      CREATE TABLE bookmark_transcript_question_answer (
        id SERIAL PRIMARY KEY,
        bookmark_id INTEGER,
        transcript_question_answer_id INTEGER,
        FOREIGN KEY(bookmark_id) REFERENCES bookmark(id) ON DELETE CASCADE,
        FOREIGN KEY(transcript_question_answer_id) REFERENCES transcript_question_answer(id) ON DELETE CASCADE
      );`;
  }

  console.log('Seeding data');

  // Seed 5 transcripts
  const transcripts = Array.from({ length: 5 }, () => faker.person.fullName());

  console.log('transcripts', transcripts);

  const createdTs = await Promise.all(
    transcripts.map(
      (t) =>
        sql<Transcript>`INSERT INTO transcript (interview_name) VALUES (${t}) RETURNING id;`
    )
  );

  const transcriptRows = createdTs.flatMap((t) => t.rows);

  const qaRows = transcriptRows.flatMap((transcript) => {
    const transcriptId = transcript.id;

    return Array.from({ length: 20 }, () => {
      const question = faker.lorem.sentence() + '?';
      const answer = faker.lorem.paragraph();
      return [transcriptId, question, answer];
    });
  });

  await Promise.all(
    qaRows.map(
      (qa) =>
        sql`INSERT INTO transcript_question_answer (transcript_id, question, answer) VALUES (${qa[0]}, ${qa[1]}, ${qa[2]})`
    )
  );

  console.log('created question-answer rows:', qaRows);
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reset = searchParams.get('reset');

  try {
    await sql`BEGIN`;
    await seedDb({ reset: reset === 'true' });
    await sql`COMMIT`;
  } catch (error) {
    console.error(error);
    await sql`ROLLBACK`;
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
