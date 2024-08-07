export interface BookmarkSummary {
  summary: string;
}

export interface BookmarkDirectory {
  id: string;
  name: string;
  bookmarks: Bookmark[];
}

export interface Bookmark {
  id: string;
  text: string;
  question: string;
}

export interface Transcript {
  id: string;
  interview_name: string;
}

export interface TranscriptQA {
  id: string;
  transcript_id: string;
  question: string;
  answer: string;
}

export interface TranscriptWithQA {
  transcript: Transcript;
  quotes: TranscriptQA[];
}
