import { useEffect, useState } from 'react';
import { supabase, type SiteSettings, type SiteSettingsUpdate } from '../../lib/supabase';

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

const css: Record<string, React.CSSProperties> = {
  label: { display: 'block', fontSize: 11, color: C.textMuted, letterSpacing: '0.1em', marginBottom: 8 },
  input: { width: '100%', padding: '10px 14px', background: '#0d0d1a', border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, fontFamily: '"JetBrains Mono", monospace, sans-serif' },
  btnPrimary: { padding: '10px 24px', background: C.green, color: '#0a0a0a', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: '0.05em', fontFamily: 'inherit' },
};

const SQL_SETUP = `-- site_settings 테이블 생성
CREATE TABLE IF NOT EXISTS public.site_settings (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  favicon_url text,
  og_image_url text,
  site_title  text,
  site_description text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read site_settings" ON public.site_settings;
CREATE POLICY "public read site_settings" ON public.site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "auth manage site_settings" ON public.site_settings;
CREATE POLICY "auth manage site_settings" ON public.site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 초기 행 삽입
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid())
  ON CONFLICT DO NOTHING;`;

function ImagePreview({ url, label }: { url: string; label: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [url]);

  if (!url) return null;

  return (
    <div style={{ marginTop: 12, padding: 12, background: '#0d0d1a', borderRadius: 8, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 8, letterSpacing: '0.08em' }}>{label} 미리보기</div>
      {!error ? (
        <img
          src={url}
          alt={label}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            maxWidth: label === '파비콘' ? 64 : '100%',
            maxHeight: label === '파비콘' ? 64 : 200,
            borderRadius: 6,
            border: `1px solid ${C.border}`,
            display: loaded ? 'block' : 'none',
            objectFit: 'contain',
          }}
        />
      ) : (
        <div style={{ fontSize: 11, color: C.red }}>이미지를 불러올 수 없습니다. URL을 확인하세요.</div>
      )}
      {!loaded && !error && (
        <div style={{ fontSize: 11, color: C.textMuted }}>로딩 중...</div>
      )}
    </div>
  );
}

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState<SiteSettingsUpdate>({
    favicon_url: '',
    og_image_url: '',
    site_title: '',
    site_description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [tableError, setTableError] = useState(false);
  const [copied, setCopied] = useState(false);

  async function fetchSettings() {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error?.message?.includes('schema cache') || error?.code === 'PGRST205' || error?.code === '42P01') {
      setTableError(true);
      setLoading(false);
      return;
    }

    if (data) {
      setSettings(data as SiteSettings);
      setForm({
        favicon_url: data.favicon_url ?? '',
        og_image_url: data.og_image_url ?? '',
        site_title: data.site_title ?? '',
        site_description: data.site_description ?? '',
      });
    }
    setLoading(false);
  }

  useEffect(() => { fetchSettings(); }, []);

  function flash(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(''), 2500);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      favicon_url: form.favicon_url || null,
      og_image_url: form.og_image_url || null,
      site_title: form.site_title || null,
      site_description: form.site_description || null,
      updated_at: new Date().toISOString(),
    };

    if (settings?.id) {
      await supabase.from('site_settings').update(payload).eq('id', settings.id);
    } else {
      await supabase.from('site_settings').insert(payload);
    }

    flash('저장 완료 ✓');
    fetchSettings();
    setSaving(false);
  }

  function copySQL() {
    navigator.clipboard.writeText(SQL_SETUP).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (tableError) {
    return (
      <div style={{ padding: '32px', maxWidth: 640 }}>
        <div style={{ fontSize: 14, color: C.orange, fontWeight: 700, marginBottom: 12 }}>
          site_settings 테이블이 없습니다
        </div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
          아래 SQL을 Supabase SQL Editor에 붙여넣고 실행하세요.
        </div>
        <div style={{ position: 'relative', padding: 16, background: '#0d0d1a', borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: 16 }}>
          <button
            onClick={copySQL}
            style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 5, border: `1px solid ${copied ? 'rgba(191,255,60,0.4)' : C.border}`, background: copied ? 'rgba(191,255,60,0.1)' : 'transparent', color: copied ? C.green : C.textMuted, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {copied ? '복사됨 ✓' : '복사하기'}
          </button>
          <pre style={{ margin: 0, fontSize: 11, lineHeight: 1.7, color: C.cyan, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', paddingRight: 80 }}>
            {SQL_SETUP}
          </pre>
        </div>
        <button
          onClick={() => { setTableError(false); fetchSettings(); }}
          style={{ ...css.btnPrimary }}
        >
          SQL 실행 완료 → 재확인
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: C.textMuted, fontSize: 13 }}>로딩 중...</div>
    );
  }

  return (
    <div style={{ padding: '24px 32px', maxWidth: 720 }}>
      {msg && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#1a1a2e', border: `1px solid ${C.green}`, color: C.green, padding: '10px 18px', borderRadius: 8, fontSize: 12, zIndex: 200 }}>
          {msg}
        </div>
      )}

      <div style={{ fontSize: 14, fontWeight: 700, color: C.green, marginBottom: 6 }}>사이트 설정</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 28, lineHeight: 1.6 }}>
        파비콘, OG 이미지(SNS 공유 썸네일), 사이트 제목·설명을 관리합니다.<br />
        이미지는 외부 URL을 입력하거나 Supabase Storage에 업로드한 URL을 사용하세요.
      </div>

      <form onSubmit={handleSave}>
        {/* 파비콘 */}
        <div style={{ marginBottom: 28, padding: 20, background: C.card, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.cyan, letterSpacing: '0.12em', marginBottom: 16 }}>FAVICON</div>
          <label style={css.label}>파비콘 이미지 URL</label>
          <input
            style={css.input}
            type="url"
            value={form.favicon_url ?? ''}
            onChange={e => setForm(f => ({ ...f, favicon_url: e.target.value }))}
            placeholder="https://example.com/favicon.ico"
          />
          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6, lineHeight: 1.5 }}>
            권장: .ico, .png, .svg (32×32 또는 16×16 px)
          </div>
          <ImagePreview url={form.favicon_url ?? ''} label="파비콘" />
        </div>

        {/* OG 이미지 */}
        <div style={{ marginBottom: 28, padding: 20, background: C.card, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.purple, letterSpacing: '0.12em', marginBottom: 16 }}>OG IMAGE (SNS 공유 썸네일)</div>
          <label style={css.label}>OG 이미지 URL</label>
          <input
            style={css.input}
            type="url"
            value={form.og_image_url ?? ''}
            onChange={e => setForm(f => ({ ...f, og_image_url: e.target.value }))}
            placeholder="https://example.com/og-image.png"
          />
          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6, lineHeight: 1.5 }}>
            권장: 1200×630 px · Open Graph, Twitter Card에 사용됩니다
          </div>
          <ImagePreview url={form.og_image_url ?? ''} label="OG 이미지" />
        </div>

        {/* 사이트 제목 / 설명 */}
        <div style={{ marginBottom: 28, padding: 20, background: C.card, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.gold, letterSpacing: '0.12em', marginBottom: 16 }}>사이트 메타 정보</div>

          <div style={{ marginBottom: 16 }}>
            <label style={css.label}>사이트 제목 (title)</label>
            <input
              style={css.input}
              type="text"
              value={form.site_title ?? ''}
              onChange={e => setForm(f => ({ ...f, site_title: e.target.value }))}
              placeholder="CAPSTONE PAGE"
              maxLength={80}
            />
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>
              브라우저 탭 제목 및 검색엔진에 표시됩니다
            </div>
          </div>

          <div>
            <label style={css.label}>사이트 설명 (description)</label>
            <textarea
              style={{ ...css.input, minHeight: 80, resize: 'vertical' }}
              value={form.site_description ?? ''}
              onChange={e => setForm(f => ({ ...f, site_description: e.target.value }))}
              placeholder="AI × 시스템 × 콘텐츠 — 실무자 CAPSTONE"
              maxLength={160}
            />
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>
              검색엔진 결과 및 SNS 공유 설명에 사용됩니다 (최대 160자)
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" style={css.btnPrimary} disabled={saving}>
            {saving ? '저장 중...' : '설정 저장하기'}
          </button>
        </div>
      </form>

      {/* 적용 안내 */}
      <div style={{ marginTop: 32, padding: 16, background: '#0d0d1a', borderRadius: 8, border: `1px solid rgba(98,114,164,0.2)` }}>
        <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: '0.1em', marginBottom: 10 }}>적용 방식 안내</div>
        <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 11, color: C.textMuted, lineHeight: 2 }}>
          <li>저장된 설정은 사이트 로드 시 <code style={{ color: C.cyan, fontSize: 10 }}>document.head</code>에 동적으로 적용됩니다.</li>
          <li>파비콘은 <code style={{ color: C.cyan, fontSize: 10 }}>&lt;link rel="icon"&gt;</code> 태그로 즉시 반영됩니다.</li>
          <li>OG 이미지는 <code style={{ color: C.cyan, fontSize: 10 }}>&lt;meta property="og:image"&gt;</code> / <code style={{ color: C.cyan, fontSize: 10 }}>twitter:image</code>에 적용됩니다.</li>
          <li>SNS 공유 캐시가 있는 경우 갱신까지 시간이 걸릴 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
