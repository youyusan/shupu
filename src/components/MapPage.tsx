'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-context';
import type { Direction, BookRecommendation } from '@/types';
import { StepIndicator } from './StepIndicator';

const directionLabels: Record<Direction, { label: string; color: string }> = {
  'anchor': { label: '你的想法最接近这里', color: '#4ECDC4' },
  'genre-variant': { label: '换个体裁试试', color: '#F59E0B' },
  'theme-neighbor': { label: '相近的主题', color: '#8B5CF6' },
  'reader-up': { label: '更专业的方向', color: '#06B6D4' },
  'reader-down': { label: '更通俗的方向', color: '#10B981' },
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

  const gridLayout: { books: BookRecommendation[]; direction: Direction; position: string; icon: React.FC<{ className?: string }> }[] = [
    { books: upBooks, direction: 'reader-up', position: 'top', icon: ArrowUpIcon },
    { books: themeBooks, direction: 'theme-neighbor', position: 'right', icon: ArrowRightIcon },
    { books: genreBooks, direction: 'genre-variant', position: 'left', icon: ArrowLeftIcon },
    { books: downBooks, direction: 'reader-down', position: 'bottom', icon: ArrowDownIcon },
  ];

  const renderBookNode = (book: BookRecommendation, index: number, isCenter = false) => {
    return (
      <button
        key={`${book.title}-${index}`}
        className={`book-node ${isCenter ? 'book-node--center' : ''}`}
        onClick={() => setSelectedBook(book)}
        aria-label={`查看 ${book.title} 的详情`}
      >
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
    return (
      <button
        key={`${book.title}-${index}`}
        className={`mobile-card ${isCenter ? 'mobile-card--center' : ''}`}
        onClick={() => setSelectedBook(book)}
        aria-label={`查看 ${book.title} 的详情`}
      >
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
          <span style={{ color: label.color }}>{label.label}</span>
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

      <nav className="nav">
        <div className="nav__left">
          <button onClick={handleBack} className="nav__back" aria-label="返回上一页">
            <ArrowLeftIcon className="w-4 h-4" />
            <span>返回</span>
          </button>
        </div>
        <div className="nav__center">
          <StepIndicator currentStep="map" />
        </div>
        <div className="nav__right">
          <button onClick={handleCopy} className="nav__action" aria-label={copied ? '已复制清单' : '复制书籍清单'}>
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4" />
                <span>复制清单</span>
              </>
            )}
          </button>
        </div>
      </nav>

      <div className="content-container">
        <div className="desktop-layout">
          

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
                <div className="mobile-label" style={{ '--direction-color': label.color } as React.CSSProperties}>
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
      </div>

      <div className="map-hint">点击书籍查看详情</div>

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
                  <h3 id="modal-title" className="modal-title">{selectedBook.title}</h3>
                  <p className="modal-author">{selectedBook.author}</p>
                  <div 
                    className="modal-tag" 
                    style={{ '--tag-color': directionLabels[selectedBook.direction]?.color } as React.CSSProperties}
                  >
                    {directionLabels[selectedBook.direction]?.label}
                  </div>
                  <p className="modal-summary">{selectedBook.coreSummary}</p>
                  {selectedBook.description && (
                    <p className="modal-desc">{selectedBook.description}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="footer">
        <button onClick={handleRestart} className="footer__btn" aria-label="重新开始，清空所有数据">
          <RotateCcwIcon className="w-4 h-4" />
          <span>重新开始</span>
        </button>
      </div>

      <style>{`
        .map-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #080C10;
          overflow-x: hidden;
        }

        .bg-nebula {
          position: absolute;
          inset: 0;
          background: url('/assets/nebula-bg.jpg') center/cover no-repeat;
          z-index: 0;
        }

        .bg-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 50% 50%, rgba(10, 26, 26, 0.4) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 30% 60%, rgba(78, 205, 196, 0.03) 0%, transparent 60%),
            linear-gradient(180deg, rgba(8,12,16,0.3) 0%, transparent 20%, transparent 80%, rgba(8,12,16,0.5) 100%);
          z-index: 1;
        }

        .nav {
          position: relative;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.5rem;
          background: rgba(8, 12, 16, 0.7);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(80, 120, 130, 0.1);
        }

        .nav__left, .nav__right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav__center {
          display: none;
        }

        .nav__back, .nav__action {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          font-size: 0.875rem;
          color: #4ECDC4;
          background: transparent;
          border: 1px solid rgba(78, 205, 196, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s, color 0.2s;
        }

        .nav__back:hover, .nav__action:hover {
          background: rgba(78, 205, 196, 0.1);
          border-color: rgba(78, 205, 196, 0.4);
        }

        .nav__back:focus-visible, .nav__action:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.5);
        }

        .content-container {
          position: relative;
          z-index: 10;
          width: 100%;
          min-height: calc(100vh - 64px - 72px);
          max-height: calc(100vh - 64px - 72px);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .desktop-layout {
          position: relative;
          width: 100%;
          min-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 1.5rem;
          padding-bottom: 4rem;
        }

        .mobile-layout {
          display: none;
        }

        .map-grid {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          grid-template-rows: auto auto auto;
          gap: 1.5rem;
          width: 100%;
          max-width: 900px;
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
        }

        .direction-books {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .book-wrapper {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .book-wrapper--center {
          animation-delay: 0.2s;
        }

        .direction-column--top .book-wrapper { animation-delay: 0.4s; }
        .direction-column--top .book-wrapper:nth-child(2) { animation-delay: 0.5s; }
        .direction-column--top .book-wrapper:nth-child(3) { animation-delay: 0.6s; }

        .direction-column--right .book-wrapper { animation-delay: 0.6s; }
        .direction-column--right .book-wrapper:nth-child(2) { animation-delay: 0.7s; }
        .direction-column--right .book-wrapper:nth-child(3) { animation-delay: 0.8s; }

        .direction-column--left .book-wrapper { animation-delay: 0.8s; }
        .direction-column--left .book-wrapper:nth-child(2) { animation-delay: 0.9s; }
        .direction-column--left .book-wrapper:nth-child(3) { animation-delay: 1s; }

        .direction-column--bottom .book-wrapper { animation-delay: 1s; }
        .direction-column--bottom .book-wrapper:nth-child(2) { animation-delay: 1.1s; }
        .direction-column--bottom .book-wrapper:nth-child(3) { animation-delay: 1.2s; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .book-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(16, 22, 30, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(80, 120, 130, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, border-color 0.3s, box-shadow 0.3s;
          min-width: 120px;
        }

        .book-node:hover {
          transform: translateY(-4px) scale(1.02);
          background: rgba(22, 30, 40, 0.9);
          border-color: rgba(78, 205, 196, 0.3);
          box-shadow: 0 12px 32px rgba(78, 205, 196, 0.1);
        }

        .book-node:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.6);
        }

        .book-node--center {
          min-width: 140px;
          border-color: rgba(78, 205, 196, 0.3);
          box-shadow: 0 0 40px rgba(78, 205, 196, 0.12);
        }

        .book-node__cover {
          width: 72px;
          height: 100px;
          border-radius: 6px;
          overflow: hidden;
          background: rgba(78, 205, 196, 0.1);
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
          color: rgba(78, 205, 196, 0.4);
        }

        .book-node__info {
          text-align: center;
          flex: 1;
          min-width: 0;
        }

        .book-node__title {
          font-size: 0.75rem;
          font-weight: 500;
          color: #F0EDE8;
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
          color: #506468;
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

        .empty-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 2rem;
          color: #506468;
          font-size: 0.875rem;
        }

        .map-hint {
          position: absolute;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          font-size: 0.8125rem;
          color: #506468;
          opacity: 0;
          animation: hintFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards;
        }

        @keyframes hintFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to { opacity: 0.5; transform: translateX(-50%) translateY(0); }
        }

        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          padding: 0.875rem 1.5rem;
          background: rgba(8, 12, 16, 0.85);
          backdrop-filter: blur(16px);
          border-top: 1px solid rgba(80, 120, 130, 0.1);
        }

        .footer__btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          color: #EF4444;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s, color 0.2s;
        }

        .footer__btn:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
          color: #FCA5A5;
        }

        .footer__btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.4);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0);
          backdrop-filter: blur(0);
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
          backdrop-filter: blur(4px);
          pointer-events: auto;
        }

        .modal-content {
          position: relative;
          max-width: 480px;
          width: 100%;
          max-height: 80vh;
          background: rgba(16, 22, 30, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(80, 120, 130, 0.2);
          border-radius: 16px;
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
          color: #506468;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          z-index: 10;
          transition: color 0.2s, background-color 0.2s;
        }

        .modal-close:hover {
          color: #F0EDE8;
          background: rgba(80, 120, 130, 0.1);
        }

        .modal-close:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.5);
        }

        .modal-cover {
          width: 100%;
          height: 280px;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(78, 205, 196, 0.1);
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
          color: rgba(78, 205, 196, 0.3);
        }

        .modal-info {
          color: #F0EDE8;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .modal-author {
          font-size: 0.9375rem;
          color: #506468;
          margin-bottom: 0.75rem;
        }

        .modal-tag {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          color: var(--tag-color, #4ECDC4);
          background: rgba(78, 205, 196, 0.1);
          border-radius: 4px;
          margin-bottom: 1rem;
          border: 1px solid rgba(78, 205, 196, 0.15);
        }

        .modal-summary {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #A8A29E;
          margin-bottom: 1rem;
        }

        .modal-desc {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #6B6560;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(80, 120, 130, 0.1);
        }

        @media (max-width: 768px) {
          .desktop-layout {
            display: none;
          }

          .mobile-layout {
            display: block;
            width: 100%;
            padding: 1.5rem 1rem 80px;
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
            color: var(--direction-color, #506468);
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
            background: rgba(16, 22, 30, 0.7);
            backdrop-filter: blur(16px) saturate(1.3);
            border: 1px solid rgba(80, 120, 130, 0.15);
            border-radius: 12px;
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, background 0.3s;
            margin: 0 auto;
          }

          .mobile-card:hover {
            transform: translateY(-2px);
            background: rgba(22, 30, 40, 0.8);
            border-color: rgba(80, 120, 130, 0.3);
          }

          .mobile-card:focus-visible {
            outline: none;
            box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.5);
          }

          .mobile-card--center {
            border-color: rgba(78, 205, 196, 0.2);
            box-shadow: 0 0 30px rgba(78, 205, 196, 0.08);
          }

          .mobile-card__cover {
            width: 56px;
            height: 76px;
            border-radius: 6px;
            overflow: hidden;
            background: rgba(78, 205, 196, 0.1);
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
            color: rgba(78, 205, 196, 0.4);
          }

          .mobile-card__info {
            flex: 1;
            min-width: 0;
          }

          .mobile-card__title {
            font-size: 0.875rem;
            font-weight: 500;
            color: #F0EDE8;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
          }

          .mobile-card__author {
            font-size: 0.75rem;
            color: #506468;
            margin-top: 0.25rem;
            display: block;
          }

          .mobile-card__summary {
            font-size: 0.75rem;
            color: #6B6560;
            margin-top: 0.5rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
          }

          .mobile-divider {
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(78, 205, 196, 0.2), transparent);
            margin-top: 1.5rem;
          }

          .mobile-spacer {
            height: 2rem;
          }

          .nav {
            padding: 0.75rem 1rem;
          }

          .map-hint {
            display: none;
          }

          .footer__btn {
            padding: 0.75rem 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .modal-content {
            padding: 1rem;
            border-radius: 12px;
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
          .book-wrapper { opacity: 1; animation: none; }
          .map-hint { opacity: 0.5; animation: none; }
          .modal-content { transform: none; opacity: 1; }
          .modal-overlay { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
