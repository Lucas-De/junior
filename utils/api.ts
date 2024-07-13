import axios from "axios";
import { BookmarkDirectory, BookmarkSummary } from "./types";

const api = axios.create({
  baseURL: "/api",
});

export const fetchTranscript = async () => {
  const response = await api.get(`/transcript`);
  return response.data;
};

export const addBookmark = async (
  text: string,
  transcriptId: number,
  transcriptQaId: number,
  directory: { id?: number; newName?: string }
) => {
  const response = await api.post(`/transcript/${transcriptId}/bookmarks`, {
    text,
    transcriptQaId,
    directoryId: directory.id,
    newDirectoryName: directory.newName,
  });
  return response.data;
};

export const fetchBookmarksSummary = async (
  id: number
): Promise<BookmarkSummary> => {
  const response = await api.get(`/transcript/${id}/bookmarks/summary`);
  return response.data;
};

export const fetchBookmarks = async (
  id: string,
  search: string
): Promise<BookmarkDirectory[]> => {
  const response = await api.get(`/transcript/${id}/bookmarks`, {
    params: { search },
  });
  return response.data;
};

export const fetchBookmarksDirectories = async (
  id: string
): Promise<Omit<BookmarkDirectory, "bookmarks">[]> => {
  const response = await api.get(`/transcript/${id}/bookmarks/directories`);
  return response.data;
};
