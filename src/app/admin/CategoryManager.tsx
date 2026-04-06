import { useEffect, useState, useCallback } from 'react';
import { supabase, type CategoryRecord } from '../../lib/supabase';

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
  orange: '#ffb86c',
};

const PROTECTED = '미분류'; // 삭제/이름 변경 불가

interface CategoryWithCount extends CategoryRecord {
  work_count: number;
}

export function CategoryManager() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'ok' | 'err' }>({ text: '', type: 'ok' });

  function flash(text: string, type: 'ok' | 'err' = 'ok') {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: 'ok' }), 2500);
  }

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const [{ data: cats }, { data: works }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('works').select('main_category'),
    ]);

    const countMap: Record<string, number> = {};
    (works ?? []).forEach(w => {
      const k = w.main_category ?? '미분류';
      countMap[k] = (countMap[k] ?? 0) + 1;
    });

    setCategories((cats ?? []).map(c => ({ ...c, work_count: countMap[c.name] ?? 0 })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  /* ── 추가 ── */
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (categories.some(c => c.name === name)) { flash('이미 존재하는 카테고리입니다.', 'err'); return; }
    const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.sort_order)) + 1 : 0;
    const { error } = await supabase.from('categories').insert({ name, sort_order: nextOrder });
    if (error) { flash('추가 실패: ' + error.message, 'err'); return; }
    setNewName('');
    flash(`"${name}" 카테고리 추가 완료 ✓`);
    fetchCategories();
  }

  /* ── 수정 (이름 변경) ── */
  async function handleRename(cat: CategoryWithCount) {
    const newNameTrimmed = editingName.trim();
    if (!newNameTrimmed || newNameTrimmed === cat.name) { setEditingId(null); return; }
    if (categories.some(c => c.name === newNameTrimmed && c.id !== cat.id)) {
      flash('이미 존재하는 카테고리 이름입니다.', 'err');
      return;
    }
    // categories 테이블 업데이트
    const { error: catErr } = await supabase
      .from('categories')
      .update({ name: newNameTrimmed, updated_at: new Date().toISOString() })
      .eq('id', cat.id);
    if (catErr) { flash('수정 실패: ' + catErr.message, 'err'); return; }
    // 해당 카테고리를 사용 중인 works도 업데이트
    if (cat.work_count > 0) {
      await supabase
        .from('works')
        .update({ main_category: newNameTrimmed, updated_at: new Date().toISOString() })
        .eq('main_category', cat.name);
    }
    setEditingId(null);
    flash(`"${cat.name}" → "${newNameTrimmed}" 변경 완료 ✓`);
    fetchCategories();
  }

  /* ── 삭제 ── */
  async function handleDelete(cat: CategoryWithCount) {
    const confirmMsg = cat.work_count > 0
      ? `"${cat.name}" 카테고리를 삭제하시겠습니까?\n\n이 카테고리의 작업물 ${cat.work_count}개가 '미분류'로 이동됩니다.`
      : `"${cat.name}" 카테고리를 삭제하시겠습니까?`;
    if (!confirm(confirmMsg)) return;

    if (cat.work_count > 0) {
      await supabase
        .from('works')
        .update({ main_category: '미분류', updated_at: new Date().toISOString() })
        .eq('main_category', cat.name);
    }
    await supabase.from('categories').delete().eq('id', cat.id);
    flash(`"${cat.name}" 삭제 완료`);
    fetchCategories();
  }

  /* ── 순서 이동 ── */
  async function moveOrder(cat: CategoryWithCount, dir: 'up' | 'down') {
    // 미분류는 항상 고정
    const movable = categories.filter(c => c.name !== PROTECTED);
    const idx = movable.findIndex(c => c.id === cat.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= movable.length) return;
    const swap = movable[swapIdx];
    await Promise.all([
      supabase.from('categories').update({ sort_order: swap.sort_order }).eq('id', cat.id),
      supabase.from('categories').update({ sort_order: cat.sort_order }).eq('id', swap.id),
    ]);
    fetchCategories();
  }

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px', background: '#0d0d1a',
    border: `1px solid ${C.border}`, borderRadius: 8,
    color: C.text, fontSize: 13, outline: 'none', fontFamily: 'inherit',
  };

  const movable = categories.filter(c => c.name !== PROTECTED);
  const protected_ = categories.find(c => c.name === PROTECTED);

  return (
    <div style={{ padding: '24px 32px' }}>

      {/* 알림 */}
      {msg.text && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 200,
          background: C.surface, padding: '10px 18px', borderRadius: 8, fontSize: 12,
          border: `1px solid ${msg.type === 'ok' ? C.green : C.red}`,
          color: msg.type === 'ok' ? C.green : C.red,
        }}>
          {msg.text}
        </div>
      )}

      {/* 새 카테고리 추가 */}
      <div style={{ marginBottom: 28, padding: 20, background: C.surface, borderRadius: 10, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: '0.1em', marginBottom: 14 }}>새 카테고리 추가</div>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="카테고리 이름 입력 (예: Vibe Coding, Tool, AI...)"
            maxLength={40}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px', borderRadius: 8,
              border: `1px solid rgba(191,255,60,0.3)`,
              background: 'rgba(191,255,60,0.1)', color: C.green,
              fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            + 추가
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: C.textMuted }}>로딩 중...</div>
      ) : (
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: '0.08em', marginBottom: 12 }}>
            총 {categories.length}개 카테고리 · 순서는 메인 페이지 탭 순서에 반영됩니다
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* 미분류 (고정) */}
            {protected_ && (
              <CategoryRow
                cat={protected_}
                idx={-1}
                total={movable.length}
                isProtected
                isEditing={false}
                editingName=""
                onEdit={() => {}}
                onEditChange={() => {}}
                onEditSubmit={() => {}}
                onEditCancel={() => {}}
                onDelete={() => {}}
                onMove={() => {}}
              />
            )}

            {/* 일반 카테고리 */}
            {movable.map((cat, idx) => (
              <CategoryRow
                key={cat.id}
                cat={cat}
                idx={idx}
                total={movable.length}
                isProtected={false}
                isEditing={editingId === cat.id}
                editingName={editingName}
                onEdit={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                onEditChange={setEditingName}
                onEditSubmit={() => handleRename(cat)}
                onEditCancel={() => setEditingId(null)}
                onDelete={() => handleDelete(cat)}
                onMove={dir => moveOrder(cat, dir)}
              />
            ))}

            {movable.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: C.textMuted, fontSize: 13 }}>
                아직 커스텀 카테고리가 없습니다. 위에서 추가해보세요.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 카테고리 행 컴포넌트 ── */
function CategoryRow({
  cat, idx, total, isProtected,
  isEditing, editingName,
  onEdit, onEditChange, onEditSubmit, onEditCancel,
  onDelete, onMove,
}: {
  cat: CategoryWithCount;
  idx: number;
  total: number;
  isProtected: boolean;
  isEditing: boolean;
  editingName: string;
  onEdit: () => void;
  onEditChange: (v: string) => void;
  onEditSubmit: () => void;
  onEditCancel: () => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
}) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); onEditSubmit(); }
    if (e.key === 'Escape') onEditCancel();
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '36px 1fr auto',
      alignItems: 'center',
      gap: 14,
      padding: '13px 16px',
      background: C.card,
      borderRadius: 8,
      border: `1px solid ${isProtected ? 'rgba(98,114,164,0.2)' : C.border}`,
      opacity: isProtected ? 0.7 : 1,
    }}>

      {/* 순서 버튼 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {!isProtected ? (
          <>
            <button
              onClick={() => onMove('up')}
              disabled={idx === 0}
              style={{ background: 'transparent', border: 'none', color: idx === 0 ? '#2a2a3a' : C.textMuted, cursor: idx === 0 ? 'default' : 'pointer', fontSize: 12, padding: '2px 4px', lineHeight: 1 }}
            >▲</button>
            <button
              onClick={() => onMove('down')}
              disabled={idx === total - 1}
              style={{ background: 'transparent', border: 'none', color: idx === total - 1 ? '#2a2a3a' : C.textMuted, cursor: idx === total - 1 ? 'default' : 'pointer', fontSize: 12, padding: '2px 4px', lineHeight: 1 }}
            >▼</button>
          </>
        ) : (
          <span style={{ fontSize: 11, color: '#2a2a3a', textAlign: 'center' }}>—</span>
        )}
      </div>

      {/* 이름 영역 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <input
              autoFocus
              value={editingName}
              onChange={e => onEditChange(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={40}
              style={{
                padding: '6px 10px', background: '#0d0d1a',
                border: `1px solid ${C.purple}`, borderRadius: 6,
                color: C.text, fontSize: 13, outline: 'none',
                fontFamily: 'inherit', width: '100%', maxWidth: 260,
              }}
            />
            <button
              onClick={onEditSubmit}
              style={{ padding: '5px 12px', borderRadius: 5, border: `1px solid rgba(191,255,60,0.3)`, background: 'rgba(191,255,60,0.1)', color: C.green, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
            >저장</button>
            <button
              onClick={onEditCancel}
              style={{ padding: '5px 10px', borderRadius: 5, border: `1px solid ${C.border}`, background: 'transparent', color: C.textMuted, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
            >취소</button>
          </div>
        ) : (
          <>
            <span style={{ fontSize: 14, color: isProtected ? C.textMuted : C.text, fontWeight: 500 }}>
              {cat.name}
            </span>
            {isProtected && (
              <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: 'rgba(98,114,164,0.15)', color: C.textMuted, letterSpacing: '0.08em' }}>
                기본값
              </span>
            )}
            {/* 작업물 수 */}
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 4,
              background: cat.work_count > 0 ? 'rgba(139,233,253,0.08)' : 'rgba(98,114,164,0.08)',
              color: cat.work_count > 0 ? C.cyan : C.textMuted,
              border: `1px solid ${cat.work_count > 0 ? 'rgba(139,233,253,0.2)' : 'rgba(98,114,164,0.15)'}`,
            }}>
              작업물 {cat.work_count}개
            </span>
          </>
        )}
      </div>

      {/* 액션 버튼 */}
      {!isEditing && (
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {!isProtected && (
            <>
              <button
                onClick={onEdit}
                style={{ padding: '5px 10px', borderRadius: 5, border: `1px solid rgba(189,147,249,0.3)`, background: 'rgba(189,147,249,0.1)', color: C.purple, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                수정
              </button>
              <button
                onClick={onDelete}
                style={{ padding: '5px 10px', borderRadius: 5, border: `1px solid rgba(255,85,85,0.3)`, background: 'rgba(255,85,85,0.1)', color: C.red, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                삭제
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
