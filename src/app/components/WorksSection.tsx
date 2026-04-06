import { useState, useEffect, useMemo } from 'react';
import { supabase, type WorkRecord, type CategoryRecord } from '../../lib/supabase';
import { generateLines, type WorkCodeLine } from '../../lib/worksHelpers';

/* ─── CodeCard 컴포넌트 ─── */

interface WorkItem {
  lines: WorkCodeLine[];
  filename: string;
  status: 'LIVE' | 'STOP';
  href?: string;
  is_featured: boolean;
}

function CodeCard({ lines, filename, status, href, is_featured }: WorkItem) {
  const [open, setOpen] = useState(false);
  const isLive = status === 'LIVE';

  return (
    <div className="works-code-card">
      <div
        className="works-code-header"
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}
      >
        <div className="works-code-dots">
          <span style={{ background: '#ff5555' }} />
          <span style={{ background: '#ffb86c' }} />
          <span style={{ background: '#50fa7b' }} />
        </div>
        <span className="works-code-filename">{filename}</span>
        {is_featured && (
          <span style={{ fontSize: '12px', marginLeft: '4px', lineHeight: 1 }} title="추천 작업물">★</span>
        )}
        <span
          className="works-code-badge"
          style={isLive
            ? { background: 'rgba(191,255,60,0.12)', color: '#bfff3c', border: '1px solid rgba(191,255,60,0.3)' }
            : { background: 'rgba(255,85,85,0.12)',  color: '#ff5555', border: '1px solid rgba(255,85,85,0.3)' }
          }
        >
          {status}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            color: '#6272a4',
            fontSize: '11px',
            transition: 'transform 0.25s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block',
            lineHeight: '1',
          }}
        >
          ▾
        </span>
      </div>

      {open && (
        <div className="works-code-content">
          {lines.map(({ n, tokens }) => (
            <div key={n} className="hero-code-line">
              <span className="hero-code-linenum">{n}</span>
              <span className="hero-code-tokens">
                {tokens.length === 0
                  ? <span>&nbsp;</span>
                  : tokens.map((tok, i) => (
                      <span key={i} style={{ color: tok.color }}>{tok.text}</span>
                    ))
                }
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="works-code-footer">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="works-code-link"
            onClick={e => e.stopPropagation()}
          >
            <span>→ 바로가기</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ) : (
          <span className="works-code-wip">
            <span className="works-code-wip-dot" />
            개발 진행 중
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── 탭 스타일 헬퍼 ─── */

const CATEGORY_COLORS = ['#8be9fd', '#ffb86c', '#ff79c6', '#50fa7b', '#f1fa8c', '#bd93f9'];

function getCategoryColor(tab: string, index: number): { border: string; bg: string; color: string; dot: string } {
  if (tab === '추천') return {
    border: 'rgba(255,215,0,0.4)', bg: 'rgba(255,215,0,0.12)', color: '#ffd700', dot: '#ffd700',
  };
  if (tab === '전체') return {
    border: 'rgba(189,147,249,0.4)', bg: 'rgba(189,147,249,0.15)', color: '#bd93f9', dot: '#bd93f9',
  };
  if (tab === '미분류') return {
    border: 'rgba(98,114,164,0.4)', bg: 'rgba(98,114,164,0.15)', color: '#a0aec0', dot: '#a0aec0',
  };
  const c = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  return { border: `${c}66`, bg: `${c}1a`, color: c, dot: c };
}

/* ─── WorksSection ─── */

function recordToWorkItem(record: WorkRecord): WorkItem {
  return {
    filename: record.filename,
    status: record.status,
    href: record.href ?? undefined,
    is_featured: record.is_featured,
    lines: generateLines(record),
  };
}

export function WorksSection() {
  const [activeTab, setActiveTab] = useState<string>('추천');
  const [allRecords, setAllRecords] = useState<WorkRecord[]>([]);
  const [categoryOrder, setCategoryOrder] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('works').select('*').order('sort_order', { ascending: true }),
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    ]).then(([{ data: works, error: wErr }, { data: cats, error: cErr }]) => {
      if (!wErr && works) setAllRecords(works);
      if (!cErr && cats) setCategoryOrder(cats);
      setLoading(false);
    });
  }, []);

  /* categories 테이블 순서 기준으로 탭 정렬, 작업물이 있는 것만 표시 */
  const dynamicCategories = useMemo(() => {
    const usedCats = new Set(allRecords.map(r => r.main_category ?? '미분류'));
    if (categoryOrder.length > 0) {
      // categories 테이블 순서 따름 + 테이블에 없는 카테고리는 뒤에 추가
      const ordered = categoryOrder.map(c => c.name).filter(n => usedCats.has(n));
      const extras = [...usedCats].filter(c => !categoryOrder.some(cat => cat.name === c));
      return [...ordered, ...extras];
    }
    // categories 테이블 없으면 기존 방식 (미분류 먼저)
    return [...usedCats].sort((a, b) => {
      if (a === '미분류') return -1;
      if (b === '미분류') return 1;
      return a.localeCompare(b, 'ko');
    });
  }, [allRecords, categoryOrder]);

  const tabs = useMemo(() => ['추천', '전체', ...dynamicCategories], [dynamicCategories]);

  /* 탭 카운트 */
  const counts = useMemo(() => {
    const map: Record<string, number> = {
      '추천': allRecords.filter(r => r.is_featured).length,
      '전체': allRecords.length,
    };
    dynamicCategories.forEach(cat => {
      map[cat] = allRecords.filter(r => (r.main_category ?? '미분류') === cat).length;
    });
    return map;
  }, [allRecords, dynamicCategories]);

  /* 필터링 */
  const filtered = useMemo(() => {
    let records: WorkRecord[];
    if (activeTab === '추천') records = allRecords.filter(r => r.is_featured);
    else if (activeTab === '전체') records = allRecords;
    else records = allRecords.filter(r => (r.main_category ?? '미분류') === activeTab);
    return records.map(recordToWorkItem);
  }, [activeTab, allRecords]);

  /* 탭 클릭 시 존재하지 않는 탭이면 초기화 */
  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab('추천');
    }
  }, [tabs, activeTab]);

  return (
    <section id="works" className="capstone-section reveal">
      <div className="section-label">08 — 나의 작업물</div>

      {/* 탭 필터 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {tabs.map((tab, i) => {
          const isActive = activeTab === tab;
          /* special tabs는 고정 인덱스, 동적은 special 이후 인덱스 */
          const colorIdx = tab === '추천' ? 0 : tab === '전체' ? 1 : tab === '미분류' ? 2 : i;
          const cfg = getCategoryColor(tab, colorIdx);

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: isActive ? `1px solid ${cfg.border}` : '1px solid rgba(98,114,164,0.3)',
                background: isActive ? cfg.bg : 'rgba(40,42,54,0.6)',
                color: isActive ? cfg.color : '#6272a4',
                fontSize: '11px',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            >
              {tab === '추천' ? (
                <span style={{ fontSize: '10px', lineHeight: 1 }}>★</span>
              ) : (
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: isActive ? cfg.dot : '#6272a4',
                  display: 'inline-block', flexShrink: 0,
                }} />
              )}
              {tab}
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(98,114,164,0.15)',
                color: isActive ? cfg.color : '#6272a4',
                borderRadius: '4px',
                padding: '1px 6px',
                fontSize: '10px',
                lineHeight: '1.4',
              }}>
                {counts[tab] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* 카드 그리드 */}
      {loading ? (
        <div style={{ color: '#6272a4', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>
          작업물 불러오는 중...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ color: '#6272a4', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>
          {activeTab === '추천' ? '추천 작업물이 없습니다. 어드민에서 ★ 설정해주세요.' : '해당 카테고리에 작업물이 없습니다.'}
        </div>
      ) : (
        <div className="works-grid">
          {filtered.map(work => (
            <CodeCard key={work.filename} {...work} />
          ))}
        </div>
      )}
    </section>
  );
}
