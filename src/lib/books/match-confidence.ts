import type { GoogleBookVolumeInfo } from './google-books';

export function isHighConfidence(
  aiBook: { title: string; author: string; isbn?: string },
  gbVolume: GoogleBookVolumeInfo
): boolean {
  if (aiBook.isbn && gbVolume.industryIdentifiers) {
    const gbIsbns = gbVolume.industryIdentifiers.map((id) =>
      id.identifier.replace(/-/g, '')
    );
    const cleanAiIsbn = aiBook.isbn.replace(/-/g, '');
    if (gbIsbns.some((isbn) => isbn === cleanAiIsbn)) return true;
  }

  const normalize = (s: string) =>
    s.replace(/[\s\u3000\-—·.,!?;:，。！？；：、]/g, '').toLowerCase();
  const gbTitle = normalize(gbVolume.title);
  const aiTitle = normalize(aiBook.title);
  const gbAuthors = (gbVolume.authors || []).map(normalize);
  const aiAuthor = normalize(aiBook.author);

  const titleMatch = gbTitle.includes(aiTitle) || aiTitle.includes(gbTitle);
  const authorMatch = gbAuthors.some(
    (a) => a.includes(aiAuthor) || aiAuthor.includes(a)
  );

  if (titleMatch && authorMatch) return true;
  if (titleMatch && gbAuthors.length === 0) return true;
  if (gbTitle.length > 0 && aiTitle.length > 0) {
    const minLength = Math.min(gbTitle.length, aiTitle.length);
    const matchLength = Array.from(gbTitle).filter((char, i) => char === aiTitle[i]).length;
    if (matchLength >= minLength * 0.6) return true;
  }
  
  return false;
}