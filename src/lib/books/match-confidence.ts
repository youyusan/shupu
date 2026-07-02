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

  return titleMatch && authorMatch;
}