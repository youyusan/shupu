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
    const revealElements = document.querySelectorAll('.reveal');
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

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = () => {
    if (!localInput.trim()) return;
    dispatch({ type: 'SET_RAW_INPUT', payload: localInput.trim() });
    router.push('/structured');
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <main>
        <section className="hero relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C] via-[#0A0A0C] to-[#080C10]" />
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url('/assets/hero-bg.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(4px)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-[#0A0A0C]" />
          </div>

          <div className="relative z-10 text-center">
            <h1 className="font-display text-[clamp(2.5rem,8vw,4.5rem)] font-bold text-text tracking-[-0.02em] mb-4 opacity-0 translate-y-5" style={{ animation: 'heroFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' }}>
              书谱
            </h1>
            
            <div className="flex flex-col gap-4 max-w-md mx-auto opacity-0 translate-y-5" style={{ animation: 'heroFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.8s forwards' }}>
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
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-accent">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold text-text mb-3">梳理想法</h3>
                <p className="text-text-secondary leading-relaxed">
                  输入一句话描述你的书，AI 帮你提炼核心主题、受众定位和写作方向
                </p>
              </div>

              <div className="feature-card p-8 rounded-xl bg-surface border border-border-subtle hover:bg-surface-hover hover:border-border transition-all duration-250">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-accent">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold text-text mb-3">确认理解</h3>
                <p className="text-text-secondary leading-relaxed">
                  检查 AI 的分析结果，随时调整标签和描述，确保理解准确
                </p>
              </div>

              <div className="feature-card p-8 rounded-xl bg-surface border border-border-subtle hover:bg-surface-hover hover:border-border transition-all duration-250">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-accent">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold text-text mb-3">发现方向</h3>
                <p className="text-text-secondary leading-relaxed">
                  在参考地图上发现相似的经典书籍，找到你的定位和写作灵感
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer px-4 py-8 border-t border-border-subtle text-center">
          <p className="text-sm text-text-muted">
            <span className="font-display font-semibold text-text-secondary">书谱</span> — 让你写书心中有谱
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