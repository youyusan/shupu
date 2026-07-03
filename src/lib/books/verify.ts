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

/** 编辑距离（Levenshtein distance） */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j] + 1
        );
      }
    }
  }
  return dp[m][n];
}

/**
 * 模糊匹配：子串包含 或 编辑距离相似度 >= 50%
 * 比旧版位置逐字符匹配更合理——词序重排不会判 0 分
 */
function fuzzyMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  if (na.includes(nb) || nb.includes(na)) return true;
  const maxLen = Math.max(na.length, nb.length);
  const distance = levenshtein(na, nb);
  return 1 - distance / maxLen >= 0.5;
}

async function verifyByOpenLibrary(
  title: string,
  author?: string
): Promise<boolean> {
  try {
    const query = encodeURIComponent(title);
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${query}&limit=10`,
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
  author?: string,
  isbn?: string
): Promise<GoogleBookVolumeInfo | null> {
  try {
    const { searchBooks } = await import('./google-books');
    const results = await searchBooks(title, author, isbn, 5);
    // 多结果匹配：只要有任一条标题模糊匹配即通过
    return results.find((r) => !r.title || fuzzyMatch(r.title, title)) ?? null;
  } catch {
    return null;
  }
}

/**
 * 通过网络搜索多源验证一本书是否真实存在。
 * 依次尝试：ISBN 精确搜索 -> Google Books API -> Open Library API。
 * 任一来源确认匹配即返回验证通过。
 */
export async function verifyBookExists(
  title: string,
  author?: string,
  isbn?: string
): Promise<{ exists: boolean; source: 'google-books' | 'open-library' | 'none'; volumeInfo?: GoogleBookVolumeInfo }> {
  // 0. 如果 AI 提供了 ISBN，优先用 ISBN 精确搜索（最可靠）
  if (isbn) {
    const isbnResult = await verifyByGoogleBooks('', '', isbn);
    if (isbnResult) {
      return { exists: true, source: 'google-books', volumeInfo: isbnResult };
    }
  }

  // 1. Google Books API（标题+作者搜索，多结果匹配）
  const gbResult = await verifyByGoogleBooks(title, author);
  if (gbResult) {
    return { exists: true, source: 'google-books', volumeInfo: gbResult };
  }

  // 2. Open Library API
  const olExists = await verifyByOpenLibrary(title, author);
  if (olExists) {
    return { exists: true, source: 'open-library' };
  }

  return { exists: false, source: 'none' };
}
