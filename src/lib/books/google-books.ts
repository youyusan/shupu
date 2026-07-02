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

export async function searchBook(
  title: string,
  author?: string,
  isbn?: string
): Promise<GoogleBookVolumeInfo | null> {
  try {
    let query: string;

    if (isbn) {
      query = `isbn:${isbn}`;
    } else {
      query = `intitle:${encodeURIComponent(title)}`;
      if (author) {
        query += `+inauthor:${encodeURIComponent(author)}`;
      }
      query += '&langRestrict=zh';
    }

    const response = await fetch(`${BASE_URL}?q=${query}&maxResults=1`);

    if (!response.ok) {
      return null;
    }

    const data: GoogleBooksResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    return data.items[0].volumeInfo;
  } catch {
    return null;
  }
}