import React, { useState, useEffect, useRef } from 'react';

type Token = { color: string; text: string };
type CodeLine = { n: number; tokens: Token[] };

const kw  = (text: string): Token => ({ color: '#ff79c6', text }); // keywords
const str = (text: string): Token => ({ color: '#d4ff47', text }); // strings (brand accent)
const fn  = (text: string): Token => ({ color: '#50fa7b', text }); // functions
const pr  = (text: string): Token => ({ color: '#8be9fd', text }); // properties
const cm  = (text: string): Token => ({ color: '#6272a4', text }); // comments
const nm  = (text: string): Token => ({ color: '#bd93f9', text }); // numbers
const tx  = (text: string): Token => ({ color: '#f8f8f2', text }); // default text

const lines: CodeLine[] = [
  { n:  1, tokens: [cm('// 협업툴 및 AI 시스템 설계, AI 실무 적용')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [fn('console'), tx('.'), fn('log'), tx('('), str('"바이브코딩 · 콘텐츠 프로세스 구축"'), tx(');')] },
  { n:  4, tokens: [cm('// 반복되는 업무를 구조화합니다')] },
  { n:  5, tokens: [] },
  { n:  6, tokens: [kw('function'), tx(' '), fn('capstone'), tx('('), pr('업무'), tx(') {')] },
  { n:  7, tokens: [tx('  '), kw('var'), tx(' system = '), fn('AI'), tx('.'), fn('design'), tx('('), pr('업무'), tx('),')] },
  { n:  8, tokens: [tx('      pipeline = system.'), pr('process'), tx('.'), fn('build'), tx('();')] },
  { n:  9, tokens: [] },
  { n: 10, tokens: [tx('  '), fn('removeRepetition'), tx('(pipeline);')] },
  { n: 11, tokens: [] },
  { n: 12, tokens: [kw('for'), tx(' ('), kw('var'), tx(' i = '), nm('0'), tx('; i < tasks.'), pr('length'), tx('; ++i) {')] },
  { n: 13, tokens: [tx('    '), kw('var'), tx(' step = pipeline.'), pr('steps'), tx('[i];')] },
  { n: 14, tokens: [tx('    '), kw('var'), tx(' result = step.'), fn('execute'), tx('(')] },
  { n: 15, tokens: [tx('      '), str('"자동화"'), tx(',')] },
  { n: 16, tokens: [tx('      '), kw('null'), tx(',')] },
  { n: 17, tokens: [tx('      '), str('"워크플로우 "'), tx(' + step')] },
  { n: 18, tokens: [tx('    )')] },
  { n: 19, tokens: [tx('  };')] },
  { n: 20, tokens: [kw('  if'), tx(' (step.'), pr('done'), tx(' == '), str('"실무적용"'), tx(') {')] },
  { n: 21, tokens: [tx('    system.'), pr('speed'), tx(' = 더_빠르게;')] },
  { n: 22, tokens: [tx('    result.'), pr('accuracy'), tx(' = (system.'), pr('precision'), tx(' || '), nm('1'), tx(') + '), str('"배"'), tx(';')] },
  { n: 23, tokens: [tx('  }')] },
  { n: 24, tokens: [] },
  { n: 25, tokens: [tx('  '), kw('return'), tx(' 정확하게_실행합니다;')] },
  { n: 26, tokens: [tx('}')] },
];

// Pre-compute total characters (each empty line counts as 1 virtual char for timing)
const LINE_LENGTHS = lines.map(({ tokens }) =>
  tokens.reduce((s, t) => s + t.text.length, 0) || 1
);
const TOTAL_CHARS = LINE_LENGTHS.reduce((a, b) => a + b, 0);

const TYPING_SPEED = 18;   // ms per tick
const CHARS_PER_TICK = 3;  // chars revealed per tick
const PAUSE_AFTER_MS = 1800; // pause after fully typed
const RESTART_DELAY_MS = 400; // blank pause before restart

export function HeroCodeBlock() {
  const [visibleChars, setVisibleChars] = useState(0);
  const phaseRef = useRef<'typing' | 'pausing' | 'resetting'>('typing');
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 드래그 상태
  const [animDone, setAnimDone] = useState(false); // fadeUp 애니메이션 완료 여부
  const offsetRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!animDone) return;
    draggingRef.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offsetRef.current.x, oy: offsetRef.current.y };
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!animDone) return;
    const touch = e.touches[0];
    draggingRef.current = true;
    dragStart.current = { x: touch.clientX, y: touch.clientY, ox: offsetRef.current.x, oy: offsetRef.current.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const next = {
        x: dragStart.current.ox + e.clientX - dragStart.current.x,
        y: dragStart.current.oy + e.clientY - dragStart.current.y,
      };
      offsetRef.current = next;
      setOffset({ ...next });
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current) return;
      const touch = e.touches[0];
      const next = {
        x: dragStart.current.ox + touch.clientX - dragStart.current.x,
        y: dragStart.current.oy + touch.clientY - dragStart.current.y,
      };
      offsetRef.current = next;
      setOffset({ ...next });
    };
    const handleUp = () => { draggingRef.current = false; };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, []);

  useEffect(() => {
    function tick() {
      if (phaseRef.current === 'typing') {
        setVisibleChars(prev => {
          const next = prev + CHARS_PER_TICK;
          if (next >= TOTAL_CHARS) {
            phaseRef.current = 'pausing';
            rafRef.current = setTimeout(() => {
              phaseRef.current = 'resetting';
              setVisibleChars(0);
              rafRef.current = setTimeout(() => {
                phaseRef.current = 'typing';
                rafRef.current = setTimeout(tick, TYPING_SPEED);
              }, RESTART_DELAY_MS);
            }, PAUSE_AFTER_MS);
            return TOTAL_CHARS;
          }
          rafRef.current = setTimeout(tick, TYPING_SPEED);
          return next;
        });
      }
    }

    rafRef.current = setTimeout(tick, TYPING_SPEED);
    return () => {
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, []);

  // Compute per-line visible char counts
  let charOffset = 0;
  const lineVisibility = lines.map((_, idx) => {
    const len = LINE_LENGTHS[idx];
    const charsHere = Math.max(0, Math.min(len, visibleChars - charOffset));
    const isActive = visibleChars >= charOffset && visibleChars < charOffset + len;
    charOffset += len;
    return { charsHere, isActive };
  });

  const isTyping = phaseRef.current === 'typing';

  return (
    <div
      className="hero-code-editor"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onAnimationEnd={(e) => {
        if (e.animationName === 'fadeUp') setAnimDone(true);
      }}
      style={{
        animation: animDone ? 'none' : undefined,
        transform: animDone ? `translate(${offset.x}px, ${offset.y}px)` : undefined,
        cursor: animDone ? (draggingRef.current ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none',
        touchAction: 'none',
        position: 'relative',
        zIndex: draggingRef.current ? 100 : 1,
        boxShadow: draggingRef.current ? '0 8px 32px rgba(0,0,0,0.45)' : undefined,
      }}
    >
      {/* Header bar */}
      <div className="hero-code-header">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6272a4' }}>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6272a4' }}>
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </div>

      {/* Code lines */}
      <div className="hero-code-content">
        {lines.map(({ n, tokens }, lineIdx) => {
          const { charsHere, isActive } = lineVisibility[lineIdx];
          const isEmpty = tokens.length === 0;

          // Build visible tokens for this line
          let remaining = charsHere;
          const visibleTokenSpans = tokens.map((token, i) => {
            if (remaining <= 0) return null;
            const slice = token.text.slice(0, remaining);
            remaining -= token.text.length;
            if (!slice) return null;
            return <span key={i} style={{ color: token.color }}>{slice}</span>;
          });

          const showCursor = isActive && isTyping;

          return (
            <div key={n} className="hero-code-line">
              <span className="hero-code-linenum">{n}</span>
              <span className="hero-code-tokens">
                {isEmpty ? (
                  showCursor
                    ? <span className="typing-cursor">▋</span>
                    : <span>&nbsp;</span>
                ) : (
                  <>
                    {visibleTokenSpans}
                    {showCursor && <span className="typing-cursor">▋</span>}
                    {!showCursor && charsHere === 0 && <span>&nbsp;</span>}
                  </>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
