'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-context';

const marqueeBooks = [
  { title: '百年孤独', author: '加西亚·马尔克斯', cover: '/covers/01.jpg' },
  { title: '小王子', author: '圣埃克苏佩里', cover: '/covers/02.jpg' },
  { title: '人类简史', author: '尤瓦尔·赫拉利', cover: '/covers/03.jpg' },
  { title: '活着', author: '余华', cover: '/covers/04.jpg' },
  { title: '三体', author: '刘慈欣', cover: '/covers/05.jpg' },
  { title: '设计心理学', author: '唐纳德·诺曼', cover: '/covers/06.jpg' },
  { title: '思考，快与慢', author: '丹尼尔·卡尼曼', cover: '/covers/07.jpg' },
  { title: '月亮与六便士', author: '毛姆', cover: '/covers/08.jpg' },
];

const marqueeBooks2 = [
  { title: '红楼梦', author: '曹雪芹', cover: '/covers/09.jpg' },
  { title: '原则', author: '瑞·达利欧', cover: '/covers/10.jpg' },
  { title: '被讨厌的勇气', author: '岸见一郎', cover: '/covers/11.jpg' },
  { title: '枪炮、病菌与钢铁', author: '贾雷德·戴蒙德', cover: '/covers/12.jpg' },
  { title: '瓦尔登湖', author: '梭罗', cover: '/covers/13.jpg' },
  { title: '刻意练习', author: '安德斯·艾利克森', cover: '/covers/14.jpg' },
  { title: '追风筝的人', author: '卡勒德·胡赛尼', cover: '/covers/15.jpg' },
  { title: '黑客与画家', author: '保罗·格雷厄姆', cover: '/covers/16.jpg' },
];

export default function HomePage() {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const [localInput, setLocalInput] = useState(state.rawInput);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            marquee.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(marquee);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async () => {
    if (!localInput.trim()) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_RAW_INPUT', payload: localInput.trim() });

    try {
      const response = await fetch('/api/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawInput: localInput.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        dispatch({ type: 'SET_ERROR', payload: data.error?.message || '请求失败' });
        return;
      }

      dispatch({ type: 'SET_STRUCTURED_IDEA', payload: data.data });
      dispatch({ type: 'SET_EDITED_IDEA', payload: data.data });
      router.push('/structured');
    } catch {
      dispatch({ type: 'SET_ERROR', payload: '网络错误，请稍后重试' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <a href="#main-content" className="fixed top-4 left-4 z-200 px-4 py-2 bg-accent text-bg font-medium text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity focus:opacity-100">跳过导航，直接到内容</a>
      <nav className="fixed top-0 left-0 right-0 z-100 px-4 sm:px-8 py-4 flex items-center justify-between bg-[rgba(10,10,12,0.7)] backdrop-blur-custom border-b border-border-subtle transition-all duration-300">
        <div className="font-display text-xl font-bold text-text tracking-[0.02em]">
          书<span className="text-accent">谱</span>
        </div>
        <ul className="hidden md:flex items-center gap-8 list-none">
          <li><a href="#features" className="text-sm text-text-secondary hover:text-text transition-colors">功能</a></li>
          <li><a href="#how" className="text-sm text-text-secondary hover:text-text transition-colors">使用方法</a></li>
          <li>
            <a 
              href="#hero" 
              className="px-5 py-2 bg-accent text-bg font-semibold text-sm rounded-full hover:bg-accent-hover hover:-translate-y-0.5 transition-all duration-200"
            >
              开始探索
            </a>
          </li>
        </ul>
      </nav>

      <main id="main-content">
        <section id="hero" className="hero relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-20 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/assets/hero-bg.jpg')] center/cover opacity-[0.15] saturate-[0.6] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(212,165,116,0.06)_0%,transparent_70%),radial-gradient(ellipse_40%_60%_at_20%_80%,rgba(139,110,78,0.04)_0%,transparent_60%),radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(201,149,106,0.03)_0%,transparent_60%)] pointer-events-none" />

          <div className="relative z-2 text-center max-w-4xl">
            <h1 
              className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-text leading-[1.2] tracking-[-0.02em] mb-6 opacity-0 translate-y-7"
              style={{ animation: 'heroFadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.4s forwards' }}
            >
              伟大的作品都是从<br />一个灵感开始
            </h1>
            
            <p 
              className="text-[clamp(1rem,2vw,1.25rem)] text-text-secondary max-w-2xl mx-auto mb-8 leading-[1.7] opacity-0 translate-y-5"
              style={{ animation: 'heroFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s forwards' }}
            >
              书谱帮你把模糊的写书想法变成一张有方向感的地图。<br />
              不再凭空摸索，几分钟看清方向。
            </p>

            <div 
              className="flex flex-col gap-4 max-w-md mx-auto opacity-0 translate-y-5"
              style={{ animation: 'heroFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.8s forwards' }}
            >
              <textarea
                name="book-idea"
                className="w-full px-6 py-4 bg-surface border border-border rounded-xl text-text font-body text-base resize-none outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(212,165,116,0.15)] transition-all duration-200"
                rows={3}
                placeholder="用一两句话描述你想写的书……"
                aria-label="描述你想写的书"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSubmit();
                  }
                }}
                maxLength={500}
                autoComplete="off"
                spellCheck={false}
              />
              
              <p className="text-xs text-text-muted text-left pl-1">
                建议用语音输入
              </p>

              <button
                onClick={handleSubmit}
                disabled={state.isLoading || !localInput.trim()}
                className="w-full py-4 bg-accent text-bg font-semibold rounded-xl hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(212,165,116,0.25)] active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {state.isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在分析...
                  </>
                ) : (
                  <>
                    开始探索
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </div>

            <div aria-live="polite" className="mt-6">
              {state.error && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" clipRule="evenodd" />
                  </svg>
                  <span>{state.error}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="books-showcase relative py-[clamp(4rem,10vw,8rem)] overflow-hidden">
          <div className="books-showcase-header text-center mb-16 px-4 reveal">
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text tracking-[-0.02em] mb-4">
              在书的世界里找到你的位置
            </h2>
            <p className="text-lg text-text-secondary max-w-lg mx-auto leading-[1.7]">
              从经典到前沿，每一本书都是一个灵感坐标
            </p>
          </div>

          <div ref={marqueeRef} className="book-marquee relative w-full overflow-hidden py-8">
            <div className="book-row book-row--left flex gap-6 w-max" style={{ animation: 'slideFromLeft 30s linear infinite', animationPlayState: 'paused' }}>
              {[...marqueeBooks, ...marqueeBooks].map((book, index) => (
                <button key={index} className="book-card flex-shrink-0 w-40 rounded-lg overflow-hidden bg-surface border border-border-subtle hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_0_1px_var(--color-border)] transition-all duration-350 cursor-pointer" aria-label={`查看 ${book.title}，作者 ${book.author}`}>
                  <span className="relative w-full aspect-[2/3] block">
                    <Image 
                      src={book.cover} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                      fill
                      priority={index < 4}
                    />
                  </span>
                  <span className="p-3 block">
                    <span className="text-xs font-semibold text-text truncate block">{book.title}</span>
                    <span className="text-[10px] text-text-muted mt-1 truncate block">{book.author}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="book-row book-row--right flex gap-6 w-max mt-6" style={{ animation: 'slideFromRight 30s linear infinite', animationPlayState: 'paused' }}>
              {[...marqueeBooks2, ...marqueeBooks2].map((book, index) => (
                <button key={index} className="book-card flex-shrink-0 w-40 rounded-lg overflow-hidden bg-surface border border-border-subtle hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_0_1px_var(--color-border)] transition-all duration-350 cursor-pointer" aria-label={`查看 ${book.title}，作者 ${book.author}`}>
                  <span className="relative w-full aspect-[2/3] block">
                    <Image 
                      src={book.cover} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                      fill
                      priority={index < 4}
                    />
                  </span>
                  <span className="p-3 block">
                    <span className="text-xs font-semibold text-text truncate block">{book.title}</span>
                    <span className="text-[10px] text-text-muted mt-1 truncate block">{book.author}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="absolute top-0 bottom-0 left-0 w-[12%] bg-gradient-to-r from-bg to-transparent z-3 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-[12%] bg-gradient-to-l from-bg to-transparent z-3 pointer-events-none" />
          </div>
        </section>

        <section id="features" className="features px-4 sm:px-8 py-[clamp(4rem,10vw,8rem)]">
          <div className="max-w-6xl mx-auto">
            <div className="features-header text-center mb-16">
              <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text tracking-[-0.02em] mb-4">
                书谱能帮你做什么
              </h2>
              <p className="text-lg text-text-secondary max-w-lg mx-auto leading-[1.7]">
                从灵感到方向，三步到位
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="feature-card p-8 rounded-xl bg-surface border border-border-subtle hover:bg-surface-hover hover:border-border transition-all duration-250">
                <div className="w-12 h-12 rounded-lg bg-accent-dim flex items-center justify-center mb-6 text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                    <path d="M9 18h6"/>
                    <path d="M10 22h4"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text mb-3">结构化你的想法</h3>
                <p className="text-base text-text-secondary leading-[1.7]">
                  AI 帮你把模糊灵感拆解为清晰维度——主题、体裁、读者画像、核心观点，让想法变成可以落地的框架。
                </p>
              </div>

              <div className="feature-card p-8 rounded-xl bg-surface border border-border-subtle hover:bg-surface-hover hover:border-border transition-all duration-250">
                <div className="w-12 h-12 rounded-lg bg-accent-dim flex items-center justify-center mb-6 text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.3-4.3"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text mb-3">找到对标书籍</h3>
                <p className="text-base text-text-secondary leading-[1.7]">
                  发现与你想法相似的优秀作品，站在巨人的肩膀上找到自己的独特视角。不是排行榜，是一张路径图。
                </p>
              </div>

              <div className="feature-card p-8 rounded-xl bg-surface border border-border-subtle hover:bg-surface-hover hover:border-border transition-all duration-250">
                <div className="w-12 h-12 rounded-lg bg-accent-dim flex items-center justify-center mb-6 text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text mb-3">看到方向</h3>
                <p className="text-base text-text-secondary leading-[1.7]">
                  空间化地图展示你可以走的每条路——换个体裁、换个主题、换个人群深度。每一步都有方向感。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="how-it-works px-4 sm:px-8 py-[clamp(4rem,10vw,8rem)] bg-bg-elevated border-y border-border-subtle">
          <div className="max-w-5xl mx-auto">
            <div className="how-header text-center mb-16">
              <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text tracking-[-0.02em] mb-4">
                几分钟，看清方向
              </h2>
              <p className="text-lg text-text-secondary max-w-lg mx-auto leading-[1.7]">
                从模糊到清晰的四步旅程
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="how-step text-center">
                <div className="font-display text-5xl font-bold text-accent-dim leading-none mb-4" style={{ WebkitTextStroke: '1.5px var(--color-accent)', color: 'transparent' }}>
                  01
                </div>
                <h3 className="text-lg font-semibold text-text mb-3">说出你的想法</h3>
                <p className="text-sm text-text-secondary leading-[1.7] max-w-[16rem] mx-auto">
                  用一两句话描述你想写的书，或语音说出你的灵感。无需专业术语，越模糊越好。
                </p>
              </div>

              <div className="how-step text-center">
                <div className="font-display text-5xl font-bold text-accent-dim leading-none mb-4" style={{ WebkitTextStroke: '1.5px var(--color-accent)', color: 'transparent' }}>
                  02
                </div>
                <h3 className="text-lg font-semibold text-text mb-3">AI 帮你拆解</h3>
                <p className="text-sm text-text-secondary leading-[1.7] max-w-[16rem] mx-auto">
                  AI 将你的想法拆解为主题、体裁、读者画像、核心观点，你可以确认或调整。
                </p>
              </div>

              <div className="how-step text-center">
                <div className="font-display text-5xl font-bold text-accent-dim leading-none mb-4" style={{ WebkitTextStroke: '1.5px var(--color-accent)', color: 'transparent' }}>
                  03
                </div>
                <h3 className="text-lg font-semibold text-text mb-3">拿到对标地图</h3>
                <p className="text-sm text-text-secondary leading-[1.7] max-w-[16rem] mx-auto">
                  看到与你想法相关的书籍分布，像星座图一样展示每条可能的写作路径。
                </p>
              </div>

              <div className="how-step text-center">
                <div className="font-display text-5xl font-bold text-accent-dim leading-none mb-4" style={{ WebkitTextStroke: '1.5px var(--color-accent)', color: 'transparent' }}>
                  04
                </div>
                <h3 className="text-lg font-semibold text-text mb-3">开始动笔</h3>
                <p className="text-sm text-text-secondary leading-[1.7] max-w-[16rem] mx-auto">
                  带着清晰的方向感开始你的写作之旅，不再迷茫。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="cta-section px-4 sm:px-8 py-[clamp(4rem,10vw,8rem)] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(212,165,116,0.1)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative z-1 max-w-3xl mx-auto">
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-text tracking-[-0.02em] mb-4">
              开始你的写书之旅
            </h2>
            <p className="text-lg text-text-secondary mb-8 leading-[1.7]">
              无论你现在有多么模糊的想法，书谱都能帮你找到方向。
            </p>
            
            <a 
              href="#hero"
              className="inline-flex items-center gap-2 px-10 py-5 bg-accent text-bg font-semibold rounded-full hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,165,116,0.3)] active:translate-y-0 active:scale-[0.98] transition-all duration-200"
            >
              立即探索
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
          </div>
        </section>

        <footer className="footer px-4 py-8 border-t border-border-subtle text-center">
          <p className="text-sm text-text-muted">
            <span className="font-display font-semibold text-text-secondary">书谱</span> — 为每一个想写书的人
          </p>
          <p className="text-xs text-text-muted mt-3">
            你的想法仅用于本次分析，不会被保存或用于训练
          </p>
        </footer>
      </main>

      <style>{`
        .book-marquee.is-visible .book-row--left,
        .book-marquee.is-visible .book-row--right {
          animation-play-state: running !important;
        }
        
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo);
          will-change: opacity, transform;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .reveal { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
