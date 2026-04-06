import { useEffect, useState, useMemo } from 'react';
import { supabase, type WorkRecord, type WorkInsert } from '../../lib/supabase';
import { generateLines } from '../../lib/worksHelpers';

/* ── 색상 팔레트 ── */
const C = {
  bg: '#0a0a0a',
  surface: '#1a1a2e',
  card: '#16213e',
  border: 'rgba(98,114,164,0.25)',
  text: '#f8f8f2',
  textMuted: '#6272a4',
  green: '#bfff3c',
  red: '#ff5555',
  purple: '#bd93f9',
  cyan: '#8be9fd',
  gold: '#ffd700',
};

const css: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: C.bg, color: C.text, fontFamily: '"JetBrains Mono", monospace, sans-serif' },
  center: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: C.bg },
  loginBox: { width: 380, padding: 40, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` },
  label: { display: 'block', fontSize: 11, color: C.textMuted, letterSpacing: '0.1em', marginBottom: 8 },
  input: { width: '100%', padding: '10px 14px', background: '#0d0d1a', border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' as const },
  btnPrimary: { width: '100%', padding: '12px', background: C.green, color: '#0a0a0a', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: '0.05em' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: `1px solid ${C.border}`, background: C.surface },
  btnSmall: { padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.border}`, background: 'transparent', color: C.textMuted, fontSize: 11, cursor: 'pointer', letterSpacing: '0.08em' },
  btnDanger: { padding: '5px 10px', borderRadius: 5, border: `1px solid rgba(255,85,85,0.3)`, background: 'rgba(255,85,85,0.1)', color: C.red, fontSize: 11, cursor: 'pointer' },
  btnEdit: { padding: '5px 10px', borderRadius: 5, border: `1px solid rgba(189,147,249,0.3)`, background: 'rgba(189,147,249,0.1)', color: C.purple, fontSize: 11, cursor: 'pointer' },
  btnAdd: { padding: '9px 18px', borderRadius: 7, border: `1px solid rgba(191,255,60,0.3)`, background: 'rgba(191,255,60,0.1)', color: C.green, fontSize: 12, cursor: 'pointer', letterSpacing: '0.05em' },
  modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modalBox: { width: '100%', maxWidth: 620, maxHeight: '90vh', overflow: 'auto', background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 32 },
};

/* ─── 빈 폼 기본값 ─── */
const EMPTY_FORM: Omit<WorkInsert, 'sort_order'> = {
  work_num: '',
  filename: '',
  status: 'LIVE',
  href: '',
  comment_top: '',
  type: '',
  category: '',
  url_display: '',
  url_is_locked: false,
  description_1: '',
  description_2: '',
  main_category: '미분류',
  is_featured: false,
};

/* ─── 로그인 ─── */
function LoginView({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    else onLogin();
    setLoading(false);
  }

  return (
    <div style={css.center}>
      <div style={css.loginBox}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: '0.15em', marginBottom: 8 }}>CAPSTONE · ADMIN</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.green }}>작업물 관리</div>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={css.label}>EMAIL</label>
            <input style={css.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={css.label}>PASSWORD</label>
            <input style={css.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          {error && <div style={{ color: C.red, fontSize: 12, marginBottom: 16 }}>{error}</div>}
          <button style={css.btnPrimary} type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── 작업물 폼 모달 ─── */
function WorkForm({
  initial,
  onSave,
  onClose,
  nextOrder,
  existingCategories,
}: {
  initial?: WorkRecord;
  onSave: (data: WorkInsert) => Promise<void>;
  onClose: () => void;
  nextOrder: number;
  existingCategories: string[];
}) {
  const [form, setForm] = useState<Omit<WorkInsert, 'sort_order'>>(() =>
    initial
      ? {
          work_num: initial.work_num,
          filename: initial.filename,
          status: initial.status,
          href: initial.href ?? '',
          comment_top: initial.comment_top,
          type: initial.type,
          category: initial.category,
          url_display: initial.url_display ?? '',
          url_is_locked: initial.url_is_locked,
          description_1: initial.description_1 ?? '',
          description_2: initial.description_2 ?? '',
          main_category: initial.main_category ?? '미분류',
          is_featured: initial.is_featured ?? false,
        }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [catInput, setCatInput] = useState(form.main_category ?? '미분류');

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  function setCategory(cat: string) {
    setCatInput(cat);
    set('main_category', cat);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form, main_category: catInput || '미분류', sort_order: initial?.sort_order ?? nextOrder });
    setSaving(false);
  }

  const fieldStyle = { marginBottom: 16 };
  const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
  const catSuggestions = ['미분류', ...existingCategories.filter(c => c !== '미분류')];

  return (
    <div style={css.modal} onClick={onClose}>
      <div style={css.modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.green, marginBottom: 24 }}>
          {initial ? '작업물 수정' : '새 작업물 추가'}
        </div>
        <form onSubmit={handleSave}>

          {/* 카테고리 + 추천 — 상단에 배치 */}
          <div style={{ marginBottom: 20, padding: 16, background: '#0d0d1a', borderRadius: 8, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: '0.1em', marginBottom: 12 }}>분류 설정</div>
            <div style={rowStyle}>
              <div>
                <label style={css.label}>카테고리 (main_category)</label>
                <input
                  list="cat-list"
                  style={css.input}
                  value={catInput}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="미분류"
                />
                <datalist id="cat-list">
                  {catSuggestions.map(c => <option key={c} value={c} />)}
                </datalist>
                {/* 기존 카테고리 칩 */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {catSuggestions.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      style={{
                        padding: '3px 9px',
                        borderRadius: 4,
                        border: `1px solid ${catInput === c ? C.cyan : 'rgba(98,114,164,0.3)'}`,
                        background: catInput === c ? 'rgba(139,233,253,0.12)' : 'transparent',
                        color: catInput === c ? C.cyan : C.textMuted,
                        fontSize: 10,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={css.label}>추천 여부 (is_featured)</label>
                <button
                  type="button"
                  onClick={() => set('is_featured', !form.is_featured)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: `1px solid ${form.is_featured ? 'rgba(255,215,0,0.4)' : C.border}`,
                    background: form.is_featured ? 'rgba(255,215,0,0.1)' : '#0d0d1a',
                    color: form.is_featured ? C.gold : C.textMuted,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    width: '100%',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{form.is_featured ? '★' : '☆'}</span>
                  <span style={{ fontSize: 12 }}>
                    {form.is_featured ? '추천 작업물' : '일반 작업물'}
                  </span>
                </button>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 8, lineHeight: 1.5 }}>
                  ★ 설정 시 메인페이지 '추천' 탭에 표시됩니다
                </div>
              </div>
            </div>
          </div>

          {/* 기본 정보 */}
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={css.label}>변수명 (work_num)</label>
              <input style={css.input} value={form.work_num} onChange={e => set('work_num', e.target.value)} placeholder="work_19" required />
            </div>
            <div style={fieldStyle}>
              <label style={css.label}>파일명 (filename)</label>
              <input style={css.input} value={form.filename} onChange={e => set('filename', e.target.value)} placeholder="project_name.js" required />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={css.label}>제목 (comment_top)</label>
            <input style={css.input} value={form.comment_top} onChange={e => set('comment_top', e.target.value)} placeholder="프로젝트 한줄 설명" required />
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={css.label}>타입 (type)</label>
              <input style={css.input} value={form.type} onChange={e => set('type', e.target.value)} placeholder="Notion Template" required />
            </div>
            <div style={fieldStyle}>
              <label style={css.label}>카테고리 코드 (category)</label>
              <input style={css.input} value={form.category} onChange={e => set('category', e.target.value)} placeholder="Productivity · System" required />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={css.label}>상태 (status)</label>
              <select style={{ ...css.input, cursor: 'pointer' }} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="LIVE">LIVE</option>
                <option value="STOP">STOP</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={css.label}>보안 페이지 여부</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40 }}>
                <input type="checkbox" id="locked" checked={form.url_is_locked} onChange={e => set('url_is_locked', e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                <label htmlFor="locked" style={{ fontSize: 12, color: C.textMuted, cursor: 'pointer' }}>🔒 보안페이지로 표시</label>
              </div>
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={css.label}>표시 URL (url_display) — 코드 블록에 보이는 텍스트</label>
            <input style={css.input} value={form.url_display ?? ''} onChange={e => set('url_display', e.target.value)} placeholder="notion.com/ko/@capstone" />
          </div>

          <div style={fieldStyle}>
            <label style={css.label}>실제 링크 (href) — 클릭 시 이동</label>
            <input style={css.input} value={form.href ?? ''} onChange={e => set('href', e.target.value)} placeholder="https://..." />
          </div>

          <div style={fieldStyle}>
            <label style={css.label}>설명 1 (description_1)</label>
            <input style={css.input} value={form.description_1 ?? ''} onChange={e => set('description_1', e.target.value)} placeholder="프로젝트 설명 첫번째 줄" />
          </div>

          <div style={fieldStyle}>
            <label style={css.label}>설명 2 (description_2)</label>
            <input style={css.input} value={form.description_2 ?? ''} onChange={e => set('description_2', e.target.value)} placeholder="프로젝트 설명 두번째 줄" />
          </div>

          {/* 코드 미리보기 */}
          {form.work_num && form.comment_top && form.type && form.category && (
            <div style={{ marginBottom: 20, padding: 14, background: '#0d0d1a', borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 8, letterSpacing: '0.1em' }}>코드 미리보기</div>
              {generateLines({
                id: '', work_num: form.work_num, filename: form.filename, status: form.status,
                href: form.href ?? null, sort_order: 0, comment_top: form.comment_top,
                type: form.type, category: form.category, url_display: form.url_display ?? null,
                url_is_locked: form.url_is_locked, description_1: form.description_1 ?? null,
                description_2: form.description_2 ?? null, main_category: catInput, is_featured: form.is_featured,
                created_at: '', updated_at: '',
              }).map(({ n, tokens }) => (
                <div key={n} style={{ display: 'flex', gap: 12, fontFamily: 'monospace', fontSize: 11, lineHeight: '1.7' }}>
                  <span style={{ color: C.textMuted, minWidth: 20, textAlign: 'right', userSelect: 'none' as const }}>{n}</span>
                  <span>
                    {tokens.length === 0 ? <span>&nbsp;</span> : tokens.map((tok, i) => (
                      <span key={i} style={{ color: tok.color }}>{tok.text}</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" style={css.btnSmall} onClick={onClose}>취소</button>
            <button type="submit" style={{ ...css.btnPrimary, width: 'auto', padding: '10px 24px' }} disabled={saving}>
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── 대시보드 ─── */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [works, setWorks] = useState<WorkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<WorkRecord | undefined>();
  const [msg, setMsg] = useState('');
  const [filterTab, setFilterTab] = useState<string>('전체');

  async function fetchWorks() {
    setLoading(true);
    const { data } = await supabase.from('works').select('*').order('sort_order', { ascending: true });
    setWorks(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchWorks(); }, []);

  function flash(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(''), 2500);
  }

  async function handleSave(data: WorkInsert) {
    if (editTarget) {
      await supabase.from('works').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editTarget.id);
      flash('수정 완료 ✓');
    } else {
      await supabase.from('works').insert(data);
      flash('추가 완료 ✓');
    }
    setShowForm(false);
    setEditTarget(undefined);
    fetchWorks();
  }

  async function handleDelete(id: string, filename: string) {
    if (!confirm(`"${filename}" 을 삭제하시겠습니까?`)) return;
    await supabase.from('works').delete().eq('id', id);
    flash('삭제 완료');
    fetchWorks();
  }

  async function moveOrder(work: WorkRecord, dir: 'up' | 'down') {
    const idx = works.findIndex(w => w.id === work.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= works.length) return;
    const swap = works[swapIdx];
    await Promise.all([
      supabase.from('works').update({ sort_order: swap.sort_order }).eq('id', work.id),
      supabase.from('works').update({ sort_order: work.sort_order }).eq('id', swap.id),
    ]);
    fetchWorks();
  }

  async function toggleFeatured(work: WorkRecord) {
    await supabase.from('works').update({ is_featured: !work.is_featured, updated_at: new Date().toISOString() }).eq('id', work.id);
    fetchWorks();
  }

  /* 카테고리 목록 */
  const existingCategories = useMemo(() => {
    const cats = [...new Set(works.map(w => w.main_category ?? '미분류'))];
    return cats.sort((a, b) => {
      if (a === '미분류') return -1;
      if (b === '미분류') return 1;
      return a.localeCompare(b, 'ko');
    });
  }, [works]);

  const dashTabs = ['전체', '추천', ...existingCategories];

  const filteredWorks = useMemo(() => {
    if (filterTab === '전체') return works;
    if (filterTab === '추천') return works.filter(w => w.is_featured);
    return works.filter(w => (w.main_category ?? '미분류') === filterTab);
  }, [filterTab, works]);

  async function handleLogout() {
    await supabase.auth.signOut();
    onLogout();
  }

  const featuredCount = works.filter(w => w.is_featured).length;
  const nextOrder = works.length > 0 ? Math.max(...works.map(w => w.sort_order)) + 1 : 0;

  return (
    <div style={css.page}>
      {/* 헤더 */}
      <div style={css.header}>
        <div>
          <span style={{ fontSize: 11, color: C.textMuted, letterSpacing: '0.15em' }}>CAPSTONE · ADMIN</span>
          <span style={{ fontSize: 14, color: C.green, fontWeight: 700, marginLeft: 16 }}>작업물 관리</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: C.textMuted }}>
            총 {works.length}개 · ★ 추천 {featuredCount}개
          </span>
          <a href="/" style={{ ...css.btnSmall, textDecoration: 'none', display: 'inline-block' }}>← 사이트 보기</a>
          <button style={css.btnSmall} onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      {/* 알림 */}
      {msg && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: C.surface, border: `1px solid ${C.green}`, color: C.green, padding: '10px 18px', borderRadius: 8, fontSize: 12, zIndex: 200 }}>
          {msg}
        </div>
      )}

      <div style={{ padding: '24px 32px' }}>
        {/* 탭 필터 + 추가 버튼 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {dashTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 5,
                  border: `1px solid ${filterTab === tab ? (tab === '추천' ? 'rgba(255,215,0,0.4)' : 'rgba(139,233,253,0.3)') : C.border}`,
                  background: filterTab === tab ? (tab === '추천' ? 'rgba(255,215,0,0.1)' : 'rgba(139,233,253,0.08)') : 'transparent',
                  color: filterTab === tab ? (tab === '추천' ? C.gold : C.cyan) : C.textMuted,
                  fontSize: 11,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {tab === '추천' ? '★ ' : ''}{tab}
                <span style={{ marginLeft: 5, opacity: 0.7, fontSize: 10 }}>
                  {tab === '전체' ? works.length : tab === '추천' ? featuredCount : works.filter(w => (w.main_category ?? '미분류') === tab).length}
                </span>
              </button>
            ))}
          </div>
          <button style={css.btnAdd} onClick={() => { setEditTarget(undefined); setShowForm(true); }}>
            + 새 작업물 추가
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: C.textMuted }}>로딩 중...</div>
        ) : filteredWorks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: C.textMuted }}>
            <div style={{ marginBottom: 8, fontSize: 22 }}>📭</div>
            <div>해당 카테고리에 작업물이 없습니다.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredWorks.map((work, idx) => (
              <div key={work.id} style={{
                display: 'grid',
                gridTemplateColumns: '36px 1fr auto',
                alignItems: 'center',
                gap: 16,
                padding: '14px 18px',
                background: C.card,
                borderRadius: 8,
                border: `1px solid ${work.is_featured ? 'rgba(255,215,0,0.2)' : C.border}`,
              }}>
                {/* 순서 버튼 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <button onClick={() => moveOrder(work, 'up')} disabled={idx === 0}
                    style={{ background: 'transparent', border: 'none', color: idx === 0 ? '#333' : C.textMuted, cursor: idx === 0 ? 'default' : 'pointer', fontSize: 12, padding: '2px 4px' }}>▲</button>
                  <button onClick={() => moveOrder(work, 'down')} disabled={idx === filteredWorks.length - 1}
                    style={{ background: 'transparent', border: 'none', color: idx === filteredWorks.length - 1 ? '#333' : C.textMuted, cursor: idx === filteredWorks.length - 1 ? 'default' : 'pointer', fontSize: 12, padding: '2px 4px' }}>▼</button>
                </div>

                {/* 정보 */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{work.filename}</span>
                    <span style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 4, letterSpacing: '0.08em',
                      background: work.status === 'LIVE' ? 'rgba(191,255,60,0.12)' : 'rgba(255,85,85,0.12)',
                      color: work.status === 'LIVE' ? C.green : C.red,
                      border: `1px solid ${work.status === 'LIVE' ? 'rgba(191,255,60,0.3)' : 'rgba(255,85,85,0.3)'}`,
                    }}>
                      {work.status}
                    </span>
                    {/* 카테고리 태그 */}
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 4,
                      background: 'rgba(139,233,253,0.08)', color: C.cyan,
                      border: '1px solid rgba(139,233,253,0.2)',
                    }}>
                      {work.main_category ?? '미분류'}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <span style={{ color: C.purple }}>{work.work_num}</span>
                    <span>{work.comment_top}</span>
                    {work.href && <span style={{ color: '#6272a4', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{work.href}</span>}
                  </div>
                </div>

                {/* 액션 */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                  {/* 추천 토글 */}
                  <button
                    onClick={() => toggleFeatured(work)}
                    title={work.is_featured ? '추천 해제' : '추천 설정'}
                    style={{
                      padding: '5px 8px',
                      borderRadius: 5,
                      border: `1px solid ${work.is_featured ? 'rgba(255,215,0,0.4)' : 'rgba(98,114,164,0.3)'}`,
                      background: work.is_featured ? 'rgba(255,215,0,0.12)' : 'transparent',
                      color: work.is_featured ? C.gold : C.textMuted,
                      fontSize: 14,
                      cursor: 'pointer',
                    }}
                  >
                    {work.is_featured ? '★' : '☆'}
                  </button>
                  <button style={css.btnEdit} onClick={() => { setEditTarget(work); setShowForm(true); }}>수정</button>
                  <button style={css.btnDanger} onClick={() => handleDelete(work.id, work.filename)}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 폼 모달 */}
      {showForm && (
        <WorkForm
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(undefined); }}
          nextOrder={nextOrder}
          existingCategories={existingCategories}
        />
      )}
    </div>
  );
}

/* ─── AdminPage 진입점 ─── */
export default function AdminPage() {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(!!s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === null) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a', color: '#6272a4', fontSize: 13 }}>Loading...</div>;
  if (!session) return <LoginView onLogin={() => setSession(true)} />;
  return <Dashboard onLogout={() => setSession(false)} />;
}
