-- =============================================
-- CAPSTONE 작업물 테이블 설정
-- Supabase SQL 에디터에서 순서대로 실행하세요
-- =============================================

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS public.works (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  work_num      text        NOT NULL,
  filename      text        NOT NULL,
  status        text        NOT NULL DEFAULT 'LIVE' CHECK (status IN ('LIVE', 'STOP')),
  href          text,
  sort_order    integer     NOT NULL DEFAULT 0,
  comment_top   text        NOT NULL,
  type          text        NOT NULL,
  category      text        NOT NULL,
  url_display   text,
  url_is_locked boolean     NOT NULL DEFAULT false,
  description_1 text,
  description_2 text,
  main_category text        NOT NULL DEFAULT '미분류',
  is_featured   boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 2. updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.works;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.works
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. RLS 활성화
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

-- 4. 정책 설정
DROP POLICY IF EXISTS "public read works" ON public.works;
CREATE POLICY "public read works" ON public.works
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "auth manage works" ON public.works;
CREATE POLICY "auth manage works" ON public.works
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- 5. 초기 데이터 삽입 (기존 18개 작업물, 모두 미분류/추천 없음)
-- =============================================
INSERT INTO public.works
  (work_num, filename, status, href, sort_order, comment_top, type, category, url_display, url_is_locked, description_1, description_2, main_category, is_featured)
VALUES
  ('work_01', 'notion_template.js',       'LIVE', 'https://www.notion.com/ko/@capstone',                                                    0,  '실무자가 제작한 노션 템플릿',     'Notion Template',           'Productivity · System',       'notion.com/ko/@capstone',       false, '실무에서 직접 쓰는 구조를',        '템플릿으로 공개합니다.',         '미분류', false),
  ('work_02', 'prompt_generator_2.0.js',  'LIVE', 'https://sinhumanprompt.figma.site',                                                      1,  '인물 전용 프롬프트 생성기',       'Prompt Generator',          'Vibe Coding · AI',            'sinhumanprompt.site',           false, 'AI 기반 인물 분석 및',             '프롬프트 자동 생성 도구',        '미분류', false),
  ('work_03', 'camera_hand_particles.js', 'LIVE', 'https://sinhandparticles.figma.site/',                                                   2,  '카메라 손 파티클 인터랙션',       'Interactive Experience',    'Vibe Coding · Particles',     'sinhandparticles.site',         false, '손 동작을 카메라로 인식해',         '파티클을 생성하는 인터랙션',      '미분류', false),
  ('work_04', 'mouse_particles.js',       'LIVE', 'https://sindpparticles.figma.site/',                                                     3,  '마우스 파티클 인터랙션',          'Interactive Experience',    'Vibe Coding · Particles',     'sindpparticles.site',           false, '마우스 움직임에 반응하는',          '파티클 인터랙티브 아트',         '미분류', false),
  ('work_05', 'image_shredder.js',        'LIVE', 'https://sinshredimg.figma.site/',                                                        4,  '이미지 분쇄기',                  'Image Shredder',            'Vibe Coding · Tool',          'sinshredimg.site',              false, '이미지를 픽셀 단위로 분쇄해',       '산산조각 내는 인터랙티브 툴',    '미분류', false),
  ('work_06', 'consulting_process.js',    'LIVE', 'https://capstone-id-info.notion.site/31dfcc99237780b4ae8bc1c5cec1f82b?source=copy_link', 5,  '고객 상담 전체 프로세스 앱 설계', 'App Design · UX',           'Process · Consulting',        NULL,                            true,  '고객 상담 전 과정을 설계한',       '앱 기획 및 프로세스 문서',       '미분류', false),
  ('work_07', 'mbti_form.js',             'LIVE', 'https://sinmbtiform.figma.site',                                                         6,  'MBTI 별 상담폼',                 'Consulting Form · UX',      'Vibe Coding · MBTI',          'sinmbtiform.site',              false, 'MBTI 유형별 맞춤 상담폼을',        '자동으로 생성하는 인터랙션',      '미분류', false),
  ('work_08', 'neumorphism_ui.js',        'LIVE', 'https://sinuidesign.figma.site/',                                                        7,  '뉴모피즘 UI 디자인',              'UI Design · Neumorphism',   'Vibe Coding · Design',        'sinuidesign.site',              false, '부드러운 입체감의 뉴모피즘',        '스타일로 구현한 UI 디자인',      '미분류', false),
  ('work_09', 'diglog_clock.js',          'LIVE', 'https://sindiglogclock.figma.site/',                                                     8,  '아날로그 시계의 디지털 표현',     'Interactive Clock',         'Vibe Coding · Design',        'sindiglogclock.site',           false, '아날로그 감성을 디지털로',          '재해석한 인터랙티브 시계',       '미분류', false),
  ('work_10', 'shopping_movie.js',        'STOP', 'https://claude.ai/public/artifacts/664680e9-56d7-44d2-a129-833870db72db',               9,  '쇼핑, 영화 조회기',               'Shopping · Movie Viewer',   'Vibe Coding · App',           'sinda2so.site',                 false, '쇼핑 검색과 영화 정보를',          '한 곳에서 조회하는 앱',          '미분류', false),
  ('work_11', 'face_emotion.js',          'LIVE', 'https://sinfaceemotion.figma.site',                                                     10, '얼굴표정 분석기',                 'Face Emotion Analyzer',     'Vibe Coding · AI Vision',     'sinfaceemotion.site',           false, '카메라로 얼굴 표정을 실시간',       '감지·분석하는 AI 인터랙션',      '미분류', false),
  ('work_12', 'wind_particles.js',        'LIVE', 'https://sinwindwind.figma.site/',                                                       11, '바람 그리고 파티클',              'Interactive Experience',    'Vibe Coding · Particles',     'sinwindwind.site',              false, '바람의 흐름을 파티클로',            '시각화한 인터랙티브 아트',       '미분류', false),
  ('work_13', 'discord_ansi.js',          'LIVE', 'https://sindisansi.figma.site/',                                                       12, '디스코드 ANSI 코드 꾸미기',       'Discord ANSI Styler',       'Vibe Coding · Tool',          'sindisansi.site',               false, '디스코드 채팅에서 ANSI 코드로',    '텍스트를 꾸미는 스타일링 툴',    '미분류', false),
  ('work_14', 'text_uni_trans.js',        'LIVE', 'https://textunitrans.figma.site/',                                                     13, '영문텍스트 특수문자로 변경',       'Text Unicode Translator',   'Vibe Coding · Tool',          'textunitrans.site',             false, '영문 텍스트를 유니코드 특수문자로', '변환해주는 스타일링 툴',         '미분류', false),
  ('work_15', 'vibe_form.js',             'LIVE', 'https://capstoneid.github.io/sinvibeform/',                                            14, '구글시트와 연결된 입력폼',          'Google Sheets Form',        'Vibe Coding · Tool',          'sinvibeform.io',                false, '구글시트와 실시간으로 연동되는',    '데이터 입력폼 사이트',           '미분류', false),
  ('work_16', 'mp4_to_gif_converter.js',  'LIVE', 'https://capstoneid.github.io/sinconvertmp4togif/',                                     15, 'MP4를 GIF로 변환하는 툴',         'MP4 to GIF Converter',      'Vibe Coding · Tool',          'capstoneid.sinconvertmp4togif', false, 'MP4 동영상을 GIF 파일로',          '간편하게 변환하는 컨버터',       '미분류', false),
  ('work_17', 'image_convert.js',         'LIVE', 'https://capstoneid.github.io/convertimage/',                                           16, '이미지 컨버트 사이트',             'Image Converter',           'Vibe Coding · Tool',          'capstoneid.id/convertimage/',   false, '다양한 이미지 포맷을',             '간편하게 변환하는 컨버터',       '미분류', false),
  ('work_18', 'qr_tree_generator.js',     'LIVE', 'https://capstoneid.github.io/sinsqrtree/',                                             17, 'QR 트리제작기',                   'QR Tree Generator',         'Vibe Coding · Tool',          'capstoneid.id/sinsqrtree/',     false, 'QR코드를 트리 형태로',             '시각화하는 제작 도구',           '미분류', false)
ON CONFLICT DO NOTHING;

-- =============================================
-- 6. 카테고리 테이블 생성
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL UNIQUE,
  sort_order integer     NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read categories" ON public.categories;
CREATE POLICY "public read categories" ON public.categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "auth manage categories" ON public.categories;
CREATE POLICY "auth manage categories" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

-- 기본 카테고리 데이터 ('미분류'는 항상 맨 처음)
INSERT INTO public.categories (name, sort_order) VALUES
  ('미분류', 0)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 7. 기존 테이블에 컬럼 추가 (이미 테이블이 있는 경우 실행)
-- =============================================
-- ALTER TABLE public.works ADD COLUMN IF NOT EXISTS main_category text NOT NULL DEFAULT '미분류';
-- ALTER TABLE public.works ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
-- UPDATE public.works SET main_category = '미분류', is_featured = false WHERE main_category IS NULL;
