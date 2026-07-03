'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-context';
import type { Direction, BookRecommendation } from '@/types';
import { StepIndicator } from './StepIndicator';

const directionLabels: Record<Direction, { label: string }> = {
  'anchor': { label: '你的想法最接近这里' },
  'genre-variant': { label: '不同的题材' },
  'theme-neighbor': { label: '相近的主题' },
  'reader-up': { label: '更专业的方向' },
  'reader-down': { label: '更通俗的方向' },
};

const BookIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={props.className} aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="M4 12h16" />
    <path d="M9 4v16" />
  </svg>
);

const ArrowUpIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={props.className} aria-hidden="true">
    <path d="M12 5v14M5 12l7-7 7 7" />
  </svg>
);

const ArrowDownIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={props.className} aria-hidden="true">
    <path d="M12 19V5M19 12l-7 7-7-7" />
  </svg>
);

const ArrowLeftIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={props.className} aria-hidden="true">
    <path d="M15 19l-7-7 7-7M19 12H5" />
  </svg>
);

const ArrowRightIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={props.className} aria-hidden="true">
    <path d="M9 5l7 7-7 7M5 12h14" />
  </svg>
);

const XIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className} aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const RotateCcwIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={props.className} aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const CopyIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={props.className} aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={props.className} aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const WarningIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className} aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/** 未验证书籍的警告标识 + tooltip */
const UnverifiedBadge = () => (
  <span className="unverified-badge">
    <span
      className="unverified-badge__icon"
      tabIndex={0}
      role="img"
      aria-label="未验证"
    >
      <WarningIcon className="w-4 h-4" />
    </span>
    <span className="unverified-badge__tooltip">
      未验证 — 此书 AI 可能存在幻觉，请人工验证后再参考
    </span>
  </span>
);

export function MapPage() {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookRecommendation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!state.recommendations || state.recommendations.length === 0) {
      router.push('/');
      return;
    }
  }, [state.recommendations, router]);

  useEffect(() => {
    const animElements = document.querySelectorAll('.anim');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      animElements.forEach(el => el.classList.add('active'));
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animElements.forEach(el => el.classList.add('active'));
      });
    });
  }, []);

  useEffect(() => {
    if (selectedBook) {
      setModalVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedBook]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalVisible) {
        setSelectedBook(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [modalVisible]);

  const handleBack = () => {
    router.push('/structured');
  };

  const handleRestart = () => {
    dispatch({ type: 'RESET' });
    router.push('/');
  };

  const handleCopy = () => {
    const text = state.recommendations.map(b => `${b.title} - ${b.author}\n${b.coreSummary}`).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getBooksByDirection = (direction: Direction): BookRecommendation[] => {
    return state.recommendations.filter(book => book.direction === direction);
  };

  const anchorBooks = getBooksByDirection('anchor');
  const upBooks = getBooksByDirection('reader-up');
  const downBooks = getBooksByDirection('reader-down');
  const themeBooks = getBooksByDirection('theme-neighbor');
  const genreBooks = getBooksByDirection('genre-variant');

  const gridLayout = [
    { books: upBooks, direction: 'reader-up' as Direction, position: 'top', icon: ArrowUpIcon },
    { books: themeBooks, direction: 'theme-neighbor' as Direction, position: 'right', icon: ArrowRightIcon },
    { books: genreBooks, direction: 'genre-variant' as Direction, position: 'left', icon: ArrowLeftIcon },
    { books: downBooks, direction: 'reader-down' as Direction, position: 'bottom', icon: ArrowDownIcon },
  ];

  const renderBookNode = (book: BookRecommendation, index: number, isCenter = false) => {
    const isUnverified = book.verified === false;
    return (
      <button
        key={`${book.title}-${index}`}
        className={`book-node ${isCenter ? 'book-node--center' : ''} ${isUnverified ? 'book-node--unverified' : ''}`}
        onClick={() => setSelectedBook(book)}
        aria-label={`查看 ${book.title} 的详情${isUnverified ? '（未验证）' : ''}`}
      >
        {isUnverified && <UnverifiedBadge />}
        <span className="book-node__cover">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="book-node__img" />
          ) : (
            <span className="book-node__placeholder">
              <BookIcon className="w-8 h-8" />
            </span>
          )}
        </span>
        <span className="book-node__info">
          <span className="book-node__title">{book.title}</span>
          <span className="book-node__author">{book.author}</span>
        </span>
      </button>
    );
  };

  const renderMobileCard = (book: BookRecommendation, index: number, isCenter = false) => {
    const isUnverified = book.verified === false;
    return (
      <button
        key={`${book.title}-${index}`}
        className={`mobile-card ${isCenter ? 'mobile-card--center' : ''} ${isUnverified ? 'mobile-card--unverified' : ''}`}
        onClick={() => setSelectedBook(book)}
        aria-label={`查看 ${book.title} 的详情${isUnverified ? '（未验证）' : ''}`}
      >
        {isUnverified && <UnverifiedBadge />}
        <span className="mobile-card__cover">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="mobile-card__img" />
          ) : (
            <span className="mobile-card__placeholder">
              <BookIcon className="w-6 h-6" />
            </span>
          )}
        </span>
        <span className="mobile-card__info">
          <span className="mobile-card__title">{book.title}</span>
          <span className="mobile-card__author">{book.author}</span>
          <span className="mobile-card__summary">{book.coreSummary}</span>
        </span>
      </button>
    );
  };

  const renderDirectionColumn = (books: BookRecommendation[], direction: Direction, position: string, IconComponent: React.FC<{ className?: string }>) => {
    const label = directionLabels[direction];
    if (books.length === 0) return null;

    return (
      <div className={`direction-column direction-column--${position}`}>
        <div className="direction-label">
          <IconComponent className="w-3 h-3" />
          <span>{label.label}</span>
        </div>
        <div className="direction-books">
          {books.map((book, index) => (
            <div key={`${book.title}-${index}`} className="book-wrapper">
              {renderBookNode(book, index)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!state.recommendations || state.recommendations.length === 0) {
    return null;
  }

  return (
    <div className="map-page">
      <div className="bg-nebula" />
      <div className="bg-overlay" />
      <div className="content-wrapper">
        <div className="w-full max-w-5xl">
        <header className="flex items-center justify-between mb-8 anim" data-delay="1">
          <button 
            onClick={handleBack}
            className="font-display text-xl font-bold text-text tracking-[0.02em]"
          >
            书<span className="text-accent">谱</span>
          </button>
          <button 
            onClick={handleRestart}
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors px-2 py-1.5 rounded-sm"
          >
            <RotateCcwIcon className="w-3.5 h-3.5" />
            重新开始
          </button>
        </header>

        <div className="flex justify-center mb-6 anim" data-delay="1.5">
          <StepIndicator currentStep="map" />
        </div>

        <div className="text-center mb-10">
          <h1 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold text-text leading-[1.3] tracking-[-0.02em] mb-4 anim" data-delay="2">
            你的参考地图
          </h1>
          <p className="text-[clamp(1rem,2.5vw,1.125rem)] text-text-secondary leading-[1.75] max-w-2xl mx-auto anim" data-delay="3">
            围绕你的想法，看看可以往哪些方向探索。点击书籍查看详情。
          </p>
        </div>

        <div className="flex justify-center mb-8 anim" data-delay="3.5">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-surface border border-border-subtle text-text-secondary text-sm rounded-full hover:bg-surface-hover hover:border-border hover:text-text transition-all duration-200"
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4" />
                已复制
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4" />
                复制书籍清单
              </>
            )}
          </button>
        </div>

        <div className="desktop-layout anim" data-delay="4">
          <div className="map-grid">
            <div className="grid-top">
              {renderDirectionColumn(upBooks, 'reader-up', 'top', ArrowUpIcon)}
            </div>
            <div className="grid-middle">
              <div className="grid-left">
                {renderDirectionColumn(genreBooks, 'genre-variant', 'left', ArrowLeftIcon)}
              </div>
              <div className="grid-center">
                {anchorBooks.length > 0 ? (
                  anchorBooks.map((book, index) => (
                    <div key={`${book.title}-${index}`} className="book-wrapper book-wrapper--center">
                      {renderBookNode(book, index, true)}
                    </div>
                  ))
                ) : (
                  <div className="empty-center">
                    <BookIcon className="w-10 h-10" />
                    <span>暂无参照书籍</span>
                  </div>
                )}
              </div>
              <div className="grid-right">
                {renderDirectionColumn(themeBooks, 'theme-neighbor', 'right', ArrowRightIcon)}
              </div>
            </div>
            <div className="grid-bottom">
              {renderDirectionColumn(downBooks, 'reader-down', 'bottom', ArrowDownIcon)}
            </div>
          </div>
        </div>

        <div className="mobile-layout">
          {gridLayout.map(({ books, direction, icon: IconComponent }) => {
            const label = directionLabels[direction];
            if (books.length === 0) return null;
            
            return (
              <div key={direction} className="mobile-section">
                <div className="mobile-label">
                  <IconComponent className="w-3 h-3" />
                  <span>{label.label}</span>
                </div>
                <div className="mobile-books">
                  {books.map((book, index) => {
                    const isCenter = direction === 'anchor';
                    return renderMobileCard(book, index, isCenter);
                  })}
                </div>
                <div className="mobile-divider" />
              </div>
            );
          })}

          <div className="mobile-spacer" />
        </div>

        <div className="flex justify-center mt-12 mb-8 anim" data-delay="5">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-accent border border-border rounded-full font-medium hover:bg-accent-dim hover:border-accent active:scale-[0.98] transition-all duration-200"
          >
            <RotateCcwIcon className="w-4 h-4" />
            重新开始
          </button>
        </div>
        </div>
      </div>

      {modalVisible && (
        <div 
          className={`modal-overlay ${selectedBook ? 'modal-overlay--visible' : ''}`} 
          onClick={() => setSelectedBook(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className={`modal-content ${selectedBook ? 'modal-content--visible' : ''}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close" 
              onClick={() => setSelectedBook(null)} 
              aria-label="关闭详情弹窗"
            >
              <XIcon className="w-5 h-5" />
            </button>
            
            {selectedBook && (
              <>
                <div className="modal-cover">
                  {selectedBook.coverImage ? (
                    <img src={selectedBook.coverImage} alt={selectedBook.title} />
                  ) : (
                    <div className="modal-cover-placeholder">
                      <BookIcon className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <div className="modal-info">
                  <h3 id="modal-title" className="modal-title font-display">
                    {selectedBook.title}
                    {selectedBook.verified === false && (
                      <span className="modal-unverified-tag">
                        <WarningIcon className="w-3.5 h-3.5" />
                        未验证
                      </span>
                    )}
                  </h3>
                  <p className="modal-author">{selectedBook.author}</p>
                  <div className="modal-tag">
                    {directionLabels[selectedBook.direction]?.label}
                  </div>
                  <p className="modal-summary">{selectedBook.coreSummary}</p>
                  {selectedBook.description && (
                    <p className="modal-desc">{selectedBook.description}</p>
                  )}
                  <div className="modal-links">
                    <a 
                      href={`https://book.douban.com/subject_search?search_text=${encodeURIComponent(selectedBook.title + ' ' + selectedBook.author)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-link"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                      </svg>
                      豆瓣读书
                    </a>
                    <a 
                      href={`https://www.goodreads.com/search?q=${encodeURIComponent(selectedBook.title + ' ' + selectedBook.author)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-link"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        <path d="M12 6l4 5-4 5" />
                      </svg>
                      Goodreads
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .map-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: var(--color-bg);
          overflow-x: hidden;
        }

        .bg-nebula {
          position: absolute;
          inset: 0;
          background: url('/assets/nebula-bg.jpg') center/cover no-repeat;
          z-index: 0;
          opacity: 0.6;
        }

        .bg-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 50% 50%, rgba(10, 10, 12, 0.5) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 30% 60%, rgba(212, 165, 116, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 70% 40%, rgba(212, 165, 116, 0.05) 0%, transparent 50%),
            linear-gradient(180deg, rgba(10,10,12,0.4) 0%, transparent 20%, transparent 80%, rgba(10,10,12,0.6) 100%);
          z-index: 1;
        }

        .content-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem;
        }

        .anim {
          opacity: 0;
          transform: translateY(20px);
          will-change: opacity, transform;
        }
        .anim.active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.7s var(--ease-out-expo), transform 0.7s var(--ease-out-expo);
        }
        .anim[data-delay="1"].active { transition-delay: 0s; }
        .anim[data-delay="1.5"].active { transition-delay: 0.05s; }
        .anim[data-delay="2"].active { transition-delay: 0.1s; }
        .anim[data-delay="3"].active { transition-delay: 0.2s; }
        .anim[data-delay="3.5"].active { transition-delay: 0.3s; }
        .anim[data-delay="4"].active { transition-delay: 0.4s; }
        .anim[data-delay="5"].active { transition-delay: 0.5s; }

        .desktop-layout {
          display: block;
          width: 100%;
        }

        .mobile-layout {
          display: none;
        }

        .map-grid {
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          grid-template-rows: auto auto auto;
          gap: 1.5rem;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .grid-top {
          grid-column: 2;
          grid-row: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .grid-middle {
          grid-column: 1 / -1;
          grid-row: 2;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 3rem;
        }

        .grid-left, .grid-right {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .grid-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .grid-bottom {
          grid-column: 2;
          grid-row: 3;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }

        .direction-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .direction-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .direction-books {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .book-wrapper {
          opacity: 1;
        }

        .book-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--color-surface);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, border-color 0.3s, box-shadow 0.3s;
          min-width: 120px;
        }

        .book-node:hover {
          transform: translateY(-4px) scale(1.02);
          background: var(--color-surface-hover);
          border-color: var(--color-border);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }

        .book-node:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--color-accent);
        }

        .book-node--center {
          min-width: 140px;
          border-color: var(--color-accent);
          box-shadow: 0 0 40px rgba(212, 165, 116, 0.12);
        }

        .book-node--unverified {
          border-style: dashed;
          border-color: rgba(245, 158, 11, 0.4);
        }

        .book-node--unverified:hover {
          border-color: rgba(245, 158, 11, 0.7);
        }

        .book-node__cover {
          width: 72px;
          height: 100px;
          border-radius: 6px;
          overflow: hidden;
          background: var(--color-accent-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .book-node--center .book-node__cover {
          width: 90px;
          height: 125px;
        }

        .book-node__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .book-node__placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
          opacity: 0.5;
        }

        .book-node__info {
          text-align: center;
          flex: 1;
          min-width: 0;
        }

        .book-node__title {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 110px;
          display: block;
        }

        .book-node--center .book-node__title {
          font-size: 0.875rem;
          max-width: 130px;
        }

        .book-node__author {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 110px;
        }

        .book-node--center .book-node__author {
          max-width: 130px;
        }

        /* 未验证标识 */
        .unverified-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .unverified-badge__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: rgba(245, 158, 11, 0.7);
          cursor: help;
          border-radius: 4px;
          transition: color 0.2s;
        }

        .unverified-badge__icon:hover,
        .unverified-badge__icon:focus-visible {
          outline: none;
          color: rgba(245, 158, 11, 1);
        }

        .unverified-badge__tooltip {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 200px;
          padding: 0.625rem 0.875rem;
          background: rgba(24, 24, 28, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 8px;
          color: var(--color-text-secondary);
          font-size: 0.75rem;
          line-height: 1.5;
          text-align: left;
          opacity: 0;
          transform: translateY(-4px);
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 100;
        }

        .unverified-badge__tooltip::before {
          content: '';
          position: absolute;
          top: -5px;
          right: 6px;
          width: 8px;
          height: 8px;
          background: rgba(24, 24, 28, 0.95);
          border-left: 1px solid rgba(245, 158, 11, 0.3);
          border-top: 1px solid rgba(245, 158, 11, 0.3);
          transform: rotate(45deg);
        }

        .unverified-badge__icon:hover + .unverified-badge__tooltip,
        .unverified-badge__icon:focus-visible + .unverified-badge__tooltip {
          opacity: 1;
          transform: translateY(0);
        }

        /* modal 内未验证标签 */
        .modal-unverified-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          margin-left: 0.5rem;
          padding: 0.125rem 0.5rem;
          font-size: 0.6875rem;
          font-weight: 400;
          color: rgba(245, 158, 11, 0.9);
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-full);
          vertical-align: middle;
        }

        .empty-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 2rem;
          color: var(--color-text-muted);
          font-size: 0.875rem;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          overscroll-behavior: contain;
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s;
          pointer-events: none;
        }

        .modal-overlay--visible {
          opacity: 1;
          background: rgba(0, 0, 0, 0.7);
          pointer-events: auto;
        }

        .modal-content {
          position: relative;
          max-width: 480px;
          width: 100%;
          max-height: 80vh;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          overflow-y: auto;
          transform: scale(0.92) translateY(20px);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
          opacity: 0;
        }

        .modal-overlay--visible .modal-content--visible {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          z-index: 10;
          transition: color 0.2s, background-color 0.2s;
        }

        .modal-close:hover {
          color: var(--color-text);
          background: var(--color-bg-elevated);
        }

        .modal-close:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--color-accent);
        }

        .modal-cover {
          width: 100%;
          height: 280px;
          border-radius: 12px;
          overflow: hidden;
          background: var(--color-accent-dim);
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-cover-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
          opacity: 0.4;
        }

        .modal-info {
          color: var(--color-text);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .modal-author {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
          margin-bottom: 0.75rem;
        }

        .modal-tag {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          color: var(--color-accent);
          background: var(--color-accent-dim);
          border-radius: var(--radius-full);
          margin-bottom: 1rem;
          border: 1px solid var(--color-accent);
        }

        .modal-summary {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--color-text-secondary);
          margin-bottom: 1rem;
        }

        .modal-desc {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--color-text-muted);
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border-subtle);
        }

        .modal-links {
          display: flex;
          gap: 1rem;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border-subtle);
        }

        .modal-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: var(--color-accent);
          background: var(--color-accent-dim);
          border: 1px solid var(--color-accent);
          border-radius: var(--radius-full);
          text-decoration: none;
          transition: background-color 0.2s, color 0.2s;
        }

        .modal-link:hover {
          background: var(--color-accent);
          color: var(--color-bg);
        }

        .modal-link:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--color-accent);
        }

        @media (max-width: 768px) {
          .bg-nebula {
            opacity: 0.4;
          }

          .content-wrapper {
            padding: 1.5rem 1rem;
          }

          .desktop-layout {
            display: none;
          }

          .mobile-layout {
            display: block;
            width: 100%;
          }

          .mobile-section {
            margin-bottom: 1.5rem;
          }

          .mobile-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.75rem;
            font-weight: 500;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--color-text-muted);
            margin-bottom: 0.75rem;
          }

          .mobile-books {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .mobile-card {
            width: 100%;
            max-width: 360px;
            display: flex;
            align-items: center;
            gap: 0.875rem;
            padding: 1rem;
            background: var(--color-surface);
            border: 1px solid var(--color-border-subtle);
            border-radius: var(--radius-lg);
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, background 0.3s;
            margin: 0 auto;
          }

          .mobile-card:hover {
            transform: translateY(-2px);
            background: var(--color-surface-hover);
            border-color: var(--color-border);
          }

          .mobile-card:focus-visible {
            outline: none;
            box-shadow: 0 0 0 2px var(--color-accent);
          }

          .mobile-card--center {
            border-color: var(--color-accent);
            box-shadow: 0 0 30px rgba(212, 165, 116, 0.08);
          }

          .mobile-card--unverified {
            border-style: dashed;
            border-color: rgba(245, 158, 11, 0.4);
          }

          .mobile-card--unverified:hover {
            border-color: rgba(245, 158, 11, 0.7);
          }

          .mobile-card__cover {
            width: 56px;
            height: 76px;
            border-radius: 6px;
            overflow: hidden;
            background: var(--color-accent-dim);
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-card__img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .mobile-card__placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-accent);
            opacity: 0.5;
          }

          .mobile-card__info {
            flex: 1;
            min-width: 0;
          }

          .mobile-card__title {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-text);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
          }

          .mobile-card__author {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            margin-top: 0.25rem;
            display: block;
          }

          .mobile-card__summary {
            font-size: 0.75rem;
            color: var(--color-text-secondary);
            margin-top: 0.5rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
          }

          .mobile-divider {
            height: 1px;
            background: linear-gradient(to right, transparent, var(--color-border-subtle), transparent);
            margin-top: 1.5rem;
          }

          .mobile-spacer {
            height: 2rem;
          }
        }

        @media (max-width: 480px) {
          .modal-content {
            padding: 1rem;
            border-radius: var(--radius-md);
          }

          .modal-cover {
            height: 200px;
          }

          .modal-title {
            font-size: 1.25rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .anim { opacity: 1; transform: none; }
          .modal-content { transform: none; opacity: 1; }
          .modal-overlay { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
