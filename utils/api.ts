import axios from "axios";
import { BookmarkDirectory } from "./types";

const api = axios.create({
  baseURL: "/api",
});

export const fetchTranscript = async () => {
  const response = await api.get(`/transcript`);
  return response.data;
};

export const addBookmark = async (id: string, quote: string) => {
  const response = await api.post(`/transcript/${id}`, { quote });
  return response.data;
};

export const fetchBookmarks = async (
  id: string
): Promise<BookmarkDirectory[]> => {
  const response = await api.get(`/transcript/${id}/bookmarks`);
  return response.data;
};
