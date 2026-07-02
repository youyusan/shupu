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

const coverColors = ['cover--teal', 'cover--warm', 'cover--red', 'cover--slate', 'cover--teal'];

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

  if (state.recommendations.length === 0) {
    dispatch({ type: 'GO_TO_STEP', payload: 'home' });
    return null;
  }

  const anchorBooks = getBooksByDirection('anchor');
  const genreBooks = getBooksByDirection('genre-variant');
  const themeBooks = getBooksByDirection('theme-neighbor');
  const upBooks = getBooksByDirection('reader-up');
  const downBooks = getBooksByDirection('reader-down');

  const desktopBooks = [
    { books: upBooks, position: 'node-tl', label: 'reader-up' },
    { books: themeBooks, position: 'node-tr', label: 'theme-neighbor' },
    { books: genreBooks, position: 'node-bl', label: 'genre-variant' },
    { books: downBooks, position: 'node-br', label: 'reader-down' },
  ];

  const renderBookNode = (book: BookRecommendation, index: number, isAnchor: boolean = false) => (
    <div
      key={index}
      className={`book-node ${isAnchor ? 'book-node--center' : ''}`}
      role="button"
      aria-label={book.title}
    >
      <div className={`book-cover ${coverColors[index % coverColors.length]}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width={isAnchor ? 24 : 20} height={isAnchor ? 24 : 20} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        </svg>
      </div>
      <div className="book-info">
        <div className={`book-title ${isAnchor ? 'font-bold' : ''}`}>{book.title}</div>
        <div className="book-author">{book.author}</div>
        <div className="book-summary">{book.coreSummary}</div>
      </div>
    </div>
  );

  const renderMobileCard = (book: BookRecommendation, index: number, isAnchor: boolean = false) => (
    <div
      key={index}
      className={`mobile-card ${isAnchor ? 'mobile-card--center' : ''}`}
      role="button"
      aria-label={book.title}
    >
      <div className={`book-cover ${coverColors[index % coverColors.length]}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        </svg>
      </div>
      <div className="book-info">
        <div className={`book-title ${isAnchor ? 'font-bold' : ''}`}>{book.title}</div>
        <div className="book-author">{book.author}</div>
        <div className="book-summary">{book.coreSummary}</div>
      </div>
    </div>
  );

  return (
    <div className="map-page">
      <div className="bg-nebula" />
      <div className="bg-overlay" />

      <nav className="nav">
        <div className="nav-brand font-display text-xl font-bold">书谱</div>
        <StepIndicator currentStep="map" />
        <ul className="nav-links flex gap-6 list-none">
          <li>
            <button 
              onClick={handleRestart}
              className="text-sm text-text-secondary hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-map-accent focus:ring-offset-3 focus:ring-offset-map-bg rounded"
            >
              重新开始
            </button>
          </li>
          <li>
            <button 
              onClick={handleBack}
              className="text-sm text-text-secondary hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-map-accent focus:ring-offset-3 focus:ring-offset-map-bg rounded"
            >
              返回调整
            </button>
          </li>
          <li>
            <button 
              onClick={handleCopy}
              className="text-sm text-text-secondary hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-map-accent focus:ring-offset-3 focus:ring-offset-map-bg rounded"
            >
              {copied ? '已复制' : '复制结果'}
            </button>
          </li>
        </ul>
      </nav>

      <div className="constellation desktop-only">
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

        <div className="dir-label dir-label--tl animate-label-in">更专业的方向</div>
        <div className="dir-label dir-label--tr animate-label-in">相近的主题</div>
        <div className="dir-label dir-label--bl animate-label-in">换个体裁试试</div>
        <div className="dir-label dir-label--br animate-label-in">更通俗的方向</div>

        {desktopBooks.map(({ books, position }, index) =>
          books.length > 0 && (
            <div key={position} className={`${position} animate-node-${position.split('-')[1]}`}>
              {renderBookNode(books[0], index)}
            </div>
          )
        )}

        {anchorBooks.length > 0 && (
          <div className="node-center animate-node-center">
            {renderBookNode(anchorBooks[0], 0, true)}
          </div>
        )}
      </div>

      <div className="mobile-stack mobile-only">
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

      <div className="map-hint animate-hint-in">点击书籍查看详情</div>

      <style>{`
        .map-page {
          position: relative;
          width: 100vw;
          height: 100vh;
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
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
          list-style: none;
        }
        .nav-links button {
          font-size: 0.875rem;
          color: #8AA0A8;
          transition: color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-links button:hover { color: #E8ECF0; }

        .constellation {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5rem 3rem 4rem;
        }

        .desktop-only {
          display: flex;
        }

        .mobile-only {
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

        @keyframes draw { to { stroke-dashoffset: 0; } }

        .book-node {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(16, 22, 30, 0.65);
          backdrop-filter: blur(16px) saturate(1.3);
          -webkit-backdrop-filter: blur(16px) saturate(1.3);
          border: 1px solid rgba(80, 120, 130, 0.15);
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s;
          max-width: 280px;
          z-index: 5;
        }

        .book-node:hover {
          transform: translateY(-4px) scale(1.02);
          background: rgba(22, 30, 40, 0.75);
          border-color: rgba(80, 120, 130, 0.3);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(80, 120, 130, 0.3);
        }

        .book-cover {
          width: 56px;
          height: 72px;
          border-radius: 6px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .book-cover::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
        }
        .book-cover svg {
          position: relative;
          z-index: 1;
          stroke: rgba(255,255,255,0.6);
        }

        .cover--teal   { background: linear-gradient(135deg, #1A4A4A, #2A6B6B); }
        .cover--warm   { background: linear-gradient(135deg, #6B4E2A, #8B6E4E); }
        .cover--red    { background: linear-gradient(135deg, #6B3030, #8B4A4A); }
        .cover--slate  { background: linear-gradient(135deg, #2A3A4A, #3A5060); }

        .book-info {
          flex: 1;
          min-width: 0;
        }
        .book-title {
          font-family: 'Noto Serif SC', Georgia, serif;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #E8ECF0;
          line-height: 1.35;
          margin-bottom: 0.15rem;
        }
        .book-author {
          font-size: 0.75rem;
          color: #4ECDC4;
          margin-bottom: 0.25rem;
        }
        .book-summary {
          font-size: 0.6875rem;
          color: #506468;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .book-node--center {
          max-width: 320px;
          padding: 1.25rem 1.5rem;
          border-color: rgba(78, 205, 196, 0.2);
          box-shadow: 0 0 30px rgba(78, 205, 196, 0.08), 0 12px 40px rgba(0,0,0,0.3);
          z-index: 10;
        }
        .book-node--center .book-cover { width: 64px; height: 84px; }
        .book-node--center .book-cover svg { width: 24px; height: 24px; stroke: rgba(255,255,255,0.8); }
        .book-node--center .book-title { font-size: 1.0625rem; font-weight: 700; }
        .book-node--center .book-author { font-size: 0.8125rem; }
        .book-node--center .book-summary { font-size: 0.75rem; color: #8AA0A8; }

        .book-node--center::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 12px;
          background: transparent;
          box-shadow: 0 0 40px rgba(78, 205, 196, 0.1);
          z-index: -1;
          animation: centerPulse 5s ease-in-out infinite;
        }
        @keyframes centerPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(78, 205, 196, 0.08); }
          50% { box-shadow: 0 0 60px rgba(78, 205, 196, 0.15); }
        }

        .node-center {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          animation: nodeInCenter 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards;
        }

        .node-tl {
          top: 15%;
          left: 8%;
          opacity: 0;
          animation: nodeInTL 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }
        .node-tr {
          top: 12%;
          right: 10%;
          opacity: 0;
          animation: nodeInTR 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
        }
        .node-bl {
          bottom: 22%;
          left: 10%;
          opacity: 0;
          animation: nodeInBL 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
        }
        .node-br {
          bottom: 18%;
          right: 12%;
          opacity: 0;
          animation: nodeInBR 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.0s forwards;
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
          bottom: 1.5rem;
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

        .mobile-stack {
          display: none;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 5rem 1rem 3rem;
          gap: 0.75rem;
          overflow-y: auto;
          max-height: 100vh;
          -webkit-overflow-scrolling: touch;
          z-index: 10;
        }
        .mobile-stack::-webkit-scrollbar { display: none; }
        .mobile-stack { -ms-overflow-style: none; scrollbar-width: none; }

        .mobile-card {
          width: 100%;
          max-width: 340px;
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 1rem;
          background: rgba(16, 22, 30, 0.65);
          backdrop-filter: blur(16px) saturate(1.3);
          -webkit-backdrop-filter: blur(16px) saturate(1.3);
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
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }

        @media (max-width: 768px) {
          .constellation { display: none !important; }
          .mobile-stack { display: flex !important; }
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
          body { overflow-y: auto; overflow-x: hidden; }
          .map-page { height: auto; min-height: 100vh; }
          .map-hint {
            position: relative;
            bottom: auto;
            left: auto;
            transform: none;
            padding: 1rem 0 2rem;
            text-align: center;
          }
          .dir-label { display: none; }
          .nav { padding: 0.75rem 1rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .node-tl, .node-tr, .node-bl, .node-br, .node-center,
          .dir-label, .map-hint { opacity: 1 !important; }
          .cline, .cgLOW { stroke-dashoffset: 0 !important; }
        }
      `}</style>
    </div>
  );
}
