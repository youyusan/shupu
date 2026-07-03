import { proxyFetch } from '@/lib/utils/proxy-fetch';

export interface GoogleBookVolumeInfo {
  title: string;
  authors?: string[];
  industryIdentifiers?: { type: string; identifier: string }[];
  imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  description?: string;
  publishedDate?: string;
}

interface GoogleBookItem {
  volumeInfo: GoogleBookVolumeInfo;
}

interface GoogleBooksResponse {
  items?: GoogleBookItem[];
}

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * 搜索 Google Books，返回多条结果。
 * 不加 langRestrict——很多中文书在 Google Books 未标记语言，限制会误杀。
 * 支持可选 API Key（GOOGLE_BOOKS_API_KEY），无 Key 时用匿名配额。
 */
export async function searchBooks(
  title: string,
  author?: string,
  isbn?: string,
  maxResults = 5
): Promise<GoogleBookVolumeInfo[]> {
  try {
    let query: string;

    if (isbn) {
      query = `isbn:${isbn}`;
    } else {
      query = `intitle:${encodeURIComponent(title)}`;
      if (author) {
        query += `+inauthor:${encodeURIComponent(author)}`;
      }
    }

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const keyParam = apiKey ? `&key=${apiKey}` : '';

    const response = await proxyFetch(
      `${BASE_URL}?q=${query}&maxResults=${maxResults}${keyParam}`,
      { timeout: 8000 }
    );

    if (!response.ok) return [];

    const data: GoogleBooksResponse = await response.json();

    return data.items?.map((item) => item.volumeInfo) ?? [];
  } catch {
    return [];
  }
}

/** 向后兼容：返回第一条结果 */
export async function searchBook(
  title: string,
  author?: string,
  isbn?: string
): Promise<GoogleBookVolumeInfo | null> {
  const results = await searchBooks(title, author, isbn, 1);
  return results[0] ?? null;
}
