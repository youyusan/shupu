'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-context';
import type { Direction, BookRecommendation } from '@/types';
import { StepIndicator } from './StepIndicator';

const directionLabels: Record<Direction, { label: string }> = {
  'anchor': { label: '你的想法最接近这里' },
  'genre-variant': { label: '换个体裁试试' },
  'theme-neighbor': { label: '相近的主题' },
  'reader-up': { label: '更专业的方向' },
  'reader-down': { label: '更通俗的方向' },
};

export function MapPage() {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!state.recommendations || state.recommendations.length === 0) {
      router.push('/');
      return;
    }
  }, [state.recommendations, router]);

  const handleBack = () => {
    router.push('/structured');
  };

  const handleRestart = () => {
    dispatch({ type: 'RESET' });
    router.push('/');
  };

  const getBooksByDirection = (direction: Direction): BookRecommendation[] => {
    return state.recommendations.filter(book => book.direction === direction);
  };

  const handleCopy = () => {
    const text = state.recommendations.map(b => `${b.title} - ${b.author}\n${b.coreSummary}`).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const [selectedBook, setSelectedBook] = useState<BookRecommendation | null>(null);

  const anchorBooks = getBooksByDirection('anchor');
  const upBooks = getBooksByDirection('reader-up');
  const downBooks = getBooksByDirection('reader-down');
  const themeBooks = getBooksByDirection('theme-neighbor');
  const genreBooks = getBooksByDirection('genre-variant');

  const desktopBooks = [
    { books: upBooks, position: 'node-tl' },
    { books: themeBooks, position: 'node-tr' },
    { books: genreBooks, position: 'node-bl' },
    { books: downBooks, position: 'node-br' },
  ];

  const renderBookNode = (book: BookRecommendation, index: number, isCenter = false) => {
    return (
      <div
        key={book.title + index}
        className={`book-node ${isCenter ? 'book-node--center' : ''}`}
        onClick={() => setSelectedBook(book)}
      >
        <div className="book-node__cover">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="book-node__img" />
          ) : (
            <div className="book-node__placeholder">📚</div>
          )}
        </div>
        <div className="book-node__info">
          <div className="book-node__title">{book.title}</div>
          <div className="book-node__author">{book.author}</div>
        </div>
      </div>
    );
  };

  const renderMobileCard = (book: BookRecommendation, index: number, isCenter = false) => {
    return (
      <div
        key={book.title + index}
        className={`mobile-card ${isCenter ? 'mobile-card--center' : ''}`}
        onClick={() => setSelectedBook(book)}
      >
        <div className="mobile-card__cover">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="mobile-card__img" />
          ) : (
            <div className="mobile-card__placeholder">📚</div>
          )}
        </div>
        <div className="mobile-card__info">
          <div className="mobile-card__title">{book.title}</div>
          <div className="mobile-card__author">{book.author}</div>
          <div className="mobile-card__summary">{book.coreSummary}</div>
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
          <button onClick={handleBack} className="nav__back">
            ← 返回
          </button>
        </div>
        <div className="nav__center">
          <StepIndicator currentStep="map" />
        </div>
        <div className="nav__right">
          <button onClick={handleCopy} className="nav__action">
            {copied ? '已复制' : '复制清单'}
          </button>
        </div>
      </nav>

      <div className="content-container">
        <div className="desktop-layout">
          <svg className="lines-svg" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <path className="cgLOW cgLOW--d1" d="M 500 390 Q 350 300 170 180" />
            <path className="cgLOW cgLOW--d2" d="M 500 390 Q 660 280 820 150" />
            <path className="cgLOW cgLOW--d3" d="M 500 390 Q 320 500 190 580" />
            <path className="cgLOW cgLOW--d4" d="M 500 390 Q 680 510 790 600" />

            <path className="cline cline--d1" d="M 500 390 Q 350 300 170 180" />
            <path className="cline cline--d2" d="M 500 390 Q 660 280 820 150" />
            <path className="cline cline--d3" d="M 500 390 Q 320 500 190 580" />
            <path className="cline cline--d4" d="M 500 390 Q 680 510 790 600" />
          </svg>

          <div className="dir-label dir-label--tl">更专业的方向</div>
          <div className="dir-label dir-label--tr">相近的主题</div>
          <div className="dir-label dir-label--bl">换个体裁试试</div>
          <div className="dir-label dir-label--br">更通俗的方向</div>

          {desktopBooks.map(({ books, position }, index) =>
            books.length > 0 && (
              <div key={position} className={`node-${position.split('-')[1]}`}>
                {renderBookNode(books[0], index)}
              </div>
            )
          )}

          {anchorBooks.length > 0 && (
            <div className="node-center">
              {renderBookNode(anchorBooks[0], 0, true)}
            </div>
          )}
        </div>

        <div className="mobile-layout">
          {upBooks.length > 0 && (
            <>
              <div className="mobile-label">{directionLabels['reader-up'].label}</div>
              {upBooks.map((book, index) => renderMobileCard(book, index))}
              <div className="mobile-connector" />
            </>
          )}

          {themeBooks.length > 0 && (
            <>
              <div className="mobile-label">{directionLabels['theme-neighbor'].label}</div>
              {themeBooks.map((book, index) => renderMobileCard(book, index))}
              <div className="mobile-connector" />
            </>
          )}

          {anchorBooks.length > 0 && (
            <>
              <div className="mobile-label">{directionLabels['anchor'].label}</div>
              {anchorBooks.map((book, index) => renderMobileCard(book, index, true))}
              <div className="mobile-connector" />
            </>
          )}

          {genreBooks.length > 0 && (
            <>
              <div className="mobile-label">{directionLabels['genre-variant'].label}</div>
              {genreBooks.map((book, index) => renderMobileCard(book, index))}
              <div className="mobile-connector" />
            </>
          )}

          {downBooks.length > 0 && (
            <>
              <div className="mobile-label">{directionLabels['reader-down'].label}</div>
              {downBooks.map((book, index) => renderMobileCard(book, index))}
            </>
          )}

          <div style={{ height: '2rem' }} />
        </div>
      </div>

      <div className="map-hint">点击书籍查看详情</div>

      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBook(null)}>×</button>
            <div className="modal-cover">
              {selectedBook.coverImage ? (
                <img src={selectedBook.coverImage} alt={selectedBook.title} />
              ) : (
                <div className="modal-cover-placeholder">📚</div>
              )}
            </div>
            <div className="modal-info">
              <h3 className="modal-title">{selectedBook.title}</h3>
              <p className="modal-author">{selectedBook.author}</p>
              <div className="modal-tag">
                {directionLabels[selectedBook.direction]?.label}
              </div>
              <p className="modal-summary">{selectedBook.coreSummary}</p>
              {selectedBook.description && (
                <p className="modal-desc">{selectedBook.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="footer">
        <button onClick={handleRestart} className="footer__btn">
          重新开始
        </button>
      </div>

      <style>{`
        .map-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #080C10;
          overflow: hidden;
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
          padding: 1rem 2rem;
          background: rgba(8, 12, 16, 0.6);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(80, 120, 130, 0.1);
        }

        .nav__left { display: flex; align-items: center; }
        .nav__center { display: none; }
        .nav__right { display: flex; align-items: center; }

        .nav__back, .nav__action {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: #4ECDC4;
          background: transparent;
          border: 1px solid rgba(78, 205, 196, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav__back:hover, .nav__action:hover {
          background: rgba(78, 205, 196, 0.1);
          border-color: rgba(78, 205, 196, 0.4);
        }

        .content-container {
          position: relative;
          z-index: 10;
          width: 100%;
          min-height: calc(100vh - 60px - 80px);
        }

        .desktop-layout {
          position: relative;
          width: 100%;
          height: calc(100vh - 60px - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .mobile-layout {
          display: none;
        }

        .lines-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .cline {
          fill: none;
          stroke: rgba(78, 205, 196, 0.25);
          stroke-width: 1;
          stroke-dasharray: 800;
          stroke-dashoffset: 800;
          animation: draw 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .cline--d1 { animation-delay: 0.5s; }
        .cline--d2 { animation-delay: 0.8s; }
        .cline--d3 { animation-delay: 1.1s; }
        .cline--d4 { animation-delay: 1.4s; }

        .cgLOW {
          fill: none;
          stroke: #4ECDC4;
          stroke-width: 8;
          stroke-dasharray: 800;
          stroke-dashoffset: 800;
          opacity: 0.06;
          filter: blur(6px);
          animation: draw 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .cgLOW--d1 { animation-delay: 0.5s; }
        .cgLOW--d2 { animation-delay: 0.8s; }
        .cgLOW--d3 { animation-delay: 1.1s; }
        .cgLOW--d4 { animation-delay: 1.4s; }

        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }

        .book-node {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(16, 22, 30, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(80, 120, 130, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 10;
          max-width: 160px;
        }

        .book-node:hover {
          transform: translateY(-4px) scale(1.02);
          background: rgba(22, 30, 40, 0.8);
          border-color: rgba(78, 205, 196, 0.3);
          box-shadow: 0 10px 30px rgba(78, 205, 196, 0.1);
        }

        .book-node--center {
          max-width: 200px;
          border-color: rgba(78, 205, 196, 0.3);
          box-shadow: 0 0 40px rgba(78, 205, 196, 0.12);
        }

        .book-node__cover {
          width: 80px;
          height: 110px;
          border-radius: 6px;
          overflow: hidden;
          background: rgba(78, 205, 196, 0.1);
        }

        .book-node--center .book-node__cover {
          width: 100px;
          height: 130px;
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
          font-size: 2rem;
        }

        .book-node__info {
          text-align: center;
        }

        .book-node__title {
          font-size: 0.75rem;
          font-weight: 500;
          color: #F0EDE8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }

        .book-node--center .book-node__title {
          font-size: 0.875rem;
          max-width: 180px;
        }

        .book-node__author {
          font-size: 0.625rem;
          color: #506468;
          margin-top: 0.25rem;
        }

        .node-tl {
          position: absolute;
          top: 18%;
          left: 8%;
          opacity: 0;
          animation: nodeInTL 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
        }
        .node-tr {
          position: absolute;
          top: 14%;
          right: 10%;
          opacity: 0;
          animation: nodeInTR 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
        }
        .node-bl {
          position: absolute;
          bottom: 22%;
          left: 10%;
          opacity: 0;
          animation: nodeInBL 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards;
        }
        .node-br {
          position: absolute;
          bottom: 18%;
          right: 12%;
          opacity: 0;
          animation: nodeInBR 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s forwards;
        }
        .node-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          animation: nodeInCenter 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }

        @keyframes nodeInTL {
          from { opacity: 0; transform: translate(-40px, -30px); }
          to { opacity: 1; transform: translate(0, 0); }
        }
        @keyframes nodeInTR {
          from { opacity: 0; transform: translate(40px, -25px); }
          to { opacity: 1; transform: translate(0, 0); }
        }
        @keyframes nodeInBL {
          from { opacity: 0; transform: translate(-35px, 30px); }
          to { opacity: 1; transform: translate(0, 0); }
        }
        @keyframes nodeInBR {
          from { opacity: 0; transform: translate(30px, 25px); }
          to { opacity: 1; transform: translate(0, 0); }
        }
        @keyframes nodeInCenter {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        .dir-label {
          position: absolute;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: #506468;
          white-space: nowrap;
          z-index: 4;
        }
        .dir-label--tl { top: calc(15% - 1.5rem); left: 8%; }
        .dir-label--bl { bottom: calc(22% - 1.5rem); left: 10%; }
        .dir-label--tr { top: calc(12% - 1.5rem); right: 10%; }
        .dir-label--br { bottom: calc(18% - 1.5rem); right: 12%; }

        .map-hint {
          position: absolute;
          bottom: 90px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          font-size: 0.8125rem;
          color: #506468;
          opacity: 0;
          animation: hintIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 2.2s forwards;
        }
        @keyframes hintIn {
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
          padding: 1rem 2rem;
          background: rgba(8, 12, 16, 0.8);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(80, 120, 130, 0.1);
        }

        .footer__btn {
          padding: 0.75rem 2rem;
          font-size: 0.875rem;
          color: #506468;
          background: transparent;
          border: 1px solid rgba(80, 120, 130, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .footer__btn:hover {
          color: #F0EDE8;
          border-color: rgba(80, 120, 130, 0.4);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
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
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2rem;
          height: 2rem;
          font-size: 1.5rem;
          color: #506468;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 10;
        }

        .modal-close:hover {
          color: #F0EDE8;
        }

        .modal-cover {
          width: 100%;
          height: 280px;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(78, 205, 196, 0.1);
          margin-bottom: 1.25rem;
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
          font-size: 4rem;
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
          color: #4ECDC4;
          background: rgba(78, 205, 196, 0.1);
          border-radius: 4px;
          margin-bottom: 1rem;
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
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 2rem 1rem 80px;
            gap: 0.75rem;
          }

          .nav__center {
            display: none;
          }

          .nav {
            padding: 0.75rem 1rem;
          }

          .map-hint {
            display: none;
          }

          .mobile-card {
            width: 100%;
            max-width: 340px;
            display: flex;
            align-items: center;
            gap: 0.875rem;
            padding: 1rem;
            background: rgba(16, 22, 30, 0.65);
            backdrop-filter: blur(16px) saturate(1.3);
            border: 1px solid rgba(80, 120, 130, 0.15);
            border-radius: 12px;
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, background 0.3s;
          }

          .mobile-card:hover {
            transform: translateY(-2px);
            background: rgba(22, 30, 40, 0.75);
            border-color: rgba(80, 120, 130, 0.3);
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
            font-size: 1.5rem;
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
          }

          .mobile-card__author {
            font-size: 0.75rem;
            color: #506468;
            margin-top: 0.25rem;
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

          .mobile-connector {
            width: 1px;
            height: 1.25rem;
            background: linear-gradient(to bottom, rgba(78, 205, 196, 0.25), transparent);
            flex-shrink: 0;
          }

          .mobile-label {
            font-size: 0.6875rem;
            color: #506468;
            letter-spacing: 0.1em;
            margin-top: 0.5rem;
            margin-bottom: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
