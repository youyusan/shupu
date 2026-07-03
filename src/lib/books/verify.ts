import type { GoogleBookVolumeInfo } from './google-books';

interface OpenLibraryDoc {
  title?: string;
  author_name?: string[];
  isbn?: string[];
  number_of_pages_median?: number;
}

interface OpenLibraryResponse {
  docs?: OpenLibraryDoc[];
  numFound?: number;
}

const normalize = (s: string) =>
  s.replace(/[\s\u3000\-—·.,!?;:，。！？；：、]/g, '').toLowerCase();

function fuzzyMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (na.includes(nb) || nb.includes(na)) return true;
  if (na.length > 0 && nb.length > 0) {
    const minLength = Math.min(na.length, nb.length);
    const matchLength = Array.from(na).filter((char, i) => char === nb[i]).length;
    if (matchLength >= minLength * 0.6) return true;
  }
  return false;
}

async function verifyByOpenLibrary(
  title: string,
  author?: string
): Promise<boolean> {
  try {
    const query = encodeURIComponent(title);
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${query}&limit=5`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) return false;

    const data: OpenLibraryResponse = await response.json();
    if (!data.docs || data.docs.length === 0) return false;

    return data.docs.some((doc) => {
      const titleMatch = doc.title && fuzzyMatch(doc.title, title);
      if (!titleMatch) return false;
      if (author && doc.author_name && doc.author_name.length > 0) {
        return doc.author_name.some((a) => fuzzyMatch(a, author));
      }
      return true;
    });
  } catch {
    return false;
  }
}

async function verifyByGoogleBooks(
  title: string,
  author?: string
): Promise<GoogleBookVolumeInfo | null> {
  try {
    const { searchBook } = await import('./google-books');
    return await searchBook(title, author);
  } catch {
    return null;
  }
}

/**
 * 通过网络搜索多源验证一本书是否真实存在。
 * 依次尝试：Google Books API -> Open Library API。
 * 任一来源确认匹配即返回验证通过。
 */
export async function verifyBookExists(
  title: string,
  author?: string,
  _isbn?: string
): Promise<{ exists: boolean; source: 'google-books' | 'open-library' | 'none'; volumeInfo?: GoogleBookVolumeInfo }> {
  // 1. Google Books API
  const gbResult = await verifyByGoogleBooks(title, author);
  if (gbResult) {
    // 做简单的标题匹配确认
    if (gbResult.title && fuzzyMatch(gbResult.title, title)) {
      return { exists: true, source: 'google-books', volumeInfo: gbResult };
    }
  }

  // 2. Open Library API（对中文书覆盖更好）
  const olExists = await verifyByOpenLibrary(title, author);
  if (olExists) {
    return { exists: true, source: 'open-library' };
  }

  return { exists: false, source: 'none' };
}
