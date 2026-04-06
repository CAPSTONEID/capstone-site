import { useState, useEffect } from 'react';
import { supabase, type WorkRecord } from '../../lib/supabase';
import { generateLines, type WorkCodeLine } from '../../lib/worksHelpers';

/* ─── CodeCard 컴포넌트 ─── */

interface WorkItem {
  lines: WorkCodeLine[];
  filename: string;
  status: 'LIVE' | 'STOP';
  href?: string;
}

function CodeCard({ lines, filename, status, href }: WorkItem) {
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

/* ─── WorksSection ─── */

type TabType = 'ALL' | 'LIVE' | 'STOP';

const TAB_CONFIG: Record<TabType, { borderActive: string; bgActive: string; colorActive: string; dot: string }> = {
  ALL:  { borderActive: 'rgba(189,147,249,0.4)', bgActive: 'rgba(189,147,249,0.15)', colorActive: '#bd93f9', dot: '#bd93f9' },
  LIVE: { borderActive: 'rgba(80,250,123,0.4)',  bgActive: 'rgba(191,255,60,0.12)',  colorActive: '#50fa7b', dot: '#50fa7b' },
  STOP: { borderActive: 'rgba(255,85,85,0.4)',   bgActive: 'rgba(255,85,85,0.12)',   colorActive: '#ff5555', dot: '#ff5555' },
};

function recordToWorkItem(record: WorkRecord): WorkItem {
  return {
    filename: record.filename,
    status: record.status,
    href: record.href ?? undefined,
    lines: generateLines(record),
  };
}

export function WorksSection() {
  const [activeTab, setActiveTab] = useState<TabType>('LIVE');
  const [allWorks, setAllWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('works')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) {
          setAllWorks(data.map(recordToWorkItem));
        }
        setLoading(false);
      });
  }, []);

  const liveCount = allWorks.filter(w => w.status === 'LIVE').length;
  const stopCount = allWorks.filter(w => w.status === 'STOP').length;

  const counts: Record<TabType, number> = {
    ALL:  allWorks.length,
    LIVE: liveCount,
    STOP: stopCount,
  };

  const filtered = activeTab === 'ALL'
    ? allWorks
    : allWorks.filter(w => w.status === activeTab);

  const tabs: TabType[] = ['ALL', 'LIVE', 'STOP'];

  return (
    <section id="works" className="capstone-section reveal">
      <div className="section-label">08 — 나의 작업물</div>

      {/* 탭 필터 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          const cfg = TAB_CONFIG[tab];
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
                border: isActive ? `1px solid ${cfg.borderActive}` : '1px solid rgba(98,114,164,0.3)',
                background: isActive ? cfg.bgActive : 'rgba(40,42,54,0.6)',
                color: isActive ? cfg.colorActive : '#6272a4',
                fontSize: '11px',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            >
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isActive ? cfg.dot : '#6272a4',
                display: 'inline-block',
                flexShrink: 0,
              }} />
              {tab}
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(98,114,164,0.15)',
                color: isActive ? cfg.colorActive : '#6272a4',
                borderRadius: '4px',
                padding: '1px 6px',
                fontSize: '10px',
                lineHeight: '1.4',
              }}>
                {counts[tab]}
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
