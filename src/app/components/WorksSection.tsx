import { useState } from 'react';

type Token = { color: string; text: string };

const kw  = (t: string): Token => ({ color: '#ff79c6', text: t });
const str = (t: string): Token => ({ color: '#d4ff47', text: t });
const fn  = (t: string): Token => ({ color: '#bfff3c', text: t });
const pr  = (t: string): Token => ({ color: '#8be9fd', text: t });
const cm  = (t: string): Token => ({ color: '#6272a4', text: t });
const nm  = (t: string): Token => ({ color: '#bd93f9', text: t });
const tx  = (t: string): Token => ({ color: '#f8f8f2', text: t });
const red = (t: string): Token => ({ color: '#ff5555', text: t });

interface WorkCodeLine { n: number; tokens: Token[] }

type WorkStatus = 'LIVE' | 'STOP';

interface WorkItem {
  lines: WorkCodeLine[];
  filename: string;
  status: WorkStatus;
  href?: string;
}

/* ─── 작업물 데이터 ─── */

const notionLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 실무자가 제작한 노션 템플릿')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_01'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Notion Template"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Productivity · System"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"notion.com/ko/@capstone"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 실무에서 직접 쓰는 구조를')] },
  { n: 12, tokens: [cm('// 템플릿으로 공개합니다.')] },
];

const promptLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 인물 전용 프롬프트 생성기')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_02'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Prompt Generator"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · AI"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sinhumanprompt.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// AI 기반 인물 분석 및')] },
  { n: 12, tokens: [cm('// 프롬프트 자동 생성 도구')] },
];

const handParticlesLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 카메라 손 파티클 인터랙션')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_03'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Interactive Experience"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · Particles"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sinhandparticles.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 손 동작을 카메라로 인식해')] },
  { n: 12, tokens: [cm('// 파티클을 생성하는 인터랙션')] },
];

const mouseParticlesLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 마우스 파티클 인터랙션')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_04'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Interactive Experience"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · Particles"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sindpparticles.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 마우스 움직임에 반응하는')] },
  { n: 12, tokens: [cm('// 파티클 인터랙티브 아트')] },
];

const shredImgLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 이미지 분쇄기')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_05'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Image Shredder"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · Tool"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sinshredimg.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 이미지를 픽셀 단위로 분쇄해')] },
  { n: 12, tokens: [cm('// 산산조각 내는 인터랙티브 툴')] },
];

const consultingLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 고객 상담 전체 프로세스 앱 설계')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_06'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"App Design · UX"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Process · Consulting"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), red('"🔒 보안페이지"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 고객 상담 전 과정을 설계한')] },
  { n: 12, tokens: [cm('// 앱 기획 및 프로세스 문서')] },
];

const mbtiFormLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// MBTI 별 상담폼')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_07'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Consulting Form · UX"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · MBTI"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sinmbtiform.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// MBTI 유형별 맞춤 상담폼을')] },
  { n: 12, tokens: [cm('// 자동으로 생성하는 인터랙션')] },
];

const neumoLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 뉴모피즘 UI 디자인')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_08'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"UI Design · Neumorphism"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · Design"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sinuidesign.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 부드러운 입체감의 뉴모피즘')] },
  { n: 12, tokens: [cm('// 스타일로 구현한 UI 디자인')] },
];

const clockLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 아날로그 시계의 디지털 표현')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_09'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Interactive Clock"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · Design"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sindiglogclock.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 아날로그 감성을 디지털로')] },
  { n: 12, tokens: [cm('// 재해석한 인터랙티브 시계')] },
];

const faceEmotionLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 얼굴표정 분석기')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_11'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Face Emotion Analyzer"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · AI Vision"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sinfaceemotion.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 카메라로 얼굴 표정을 실시간')] },
  { n: 12, tokens: [cm('// 감지·분석하는 AI 인터랙션')] },
];

const windParticlesLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 바람 그리고 파티클')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_12'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Interactive Experience"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · Particles"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sinwindwind.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 바람의 흐름을 파티클로')] },
  { n: 12, tokens: [cm('// 시각화한 인터랙티브 아트')] },
];

const shoppingMovieLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 쇼핑, 영화 조회기')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_10'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Shopping · Movie Viewer"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · App"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), red('"STOP ✗"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sinda2so.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 쇼핑 검색과 영화 정보를')] },
  { n: 12, tokens: [cm('// 한 곳에서 조회하는 앱')] },
];

const discordAnsiLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 디스코드 ANSI 코드 꾸미기')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_13'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Discord ANSI Styler"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · Tool"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sindisansi.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 디스코드 채팅에서 ANSI 코드로')] },
  { n: 12, tokens: [cm('// 텍스트를 꾸미는 스타일링 툴')] },
];

const textUniTransLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 영문텍스트 특수문자로 변경')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_14'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Text Unicode Translator"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · Tool"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"textunitrans.site"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 영문 텍스트를 유니코드 특수문자로')] },
  { n: 12, tokens: [cm('// 변환해주는 스타일링 툴')] },
];

const vibeFormLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 구글시트와 연결된 입력폼')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_15'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Google Sheets Form"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · Tool"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"sinvibeform.io"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 구글시트와 실시간으로 연동되는')] },
  { n: 12, tokens: [cm('// 데이터 입력폼 사이트')] },
];

const mp4ToGifLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// MP4를 GIF로 변환하는 툴')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_16'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"MP4 to GIF Converter"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · Tool"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"capstoneid.sinconvertmp4togif"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// MP4 동영상을 GIF 파일로')] },
  { n: 12, tokens: [cm('// 간편하게 변환하는 컨버터')] },
];

const convertImageLines: WorkCodeLine[] = [
  { n:  1, tokens: [cm('// 이미지 컨버트 사이트')] },
  { n:  2, tokens: [] },
  { n:  3, tokens: [kw('const'), tx(' '), nm('work_17'), tx(' = {')] },
  { n:  4, tokens: [tx('  '), pr('type'), tx(': '), str('"Image Converter"'), tx(',')] },
  { n:  5, tokens: [tx('  '), pr('creator'), tx(': '), str('"CAPSTONE"'), tx(',')] },
  { n:  6, tokens: [tx('  '), pr('category'), tx(': '), str('"Vibe Coding · Tool"'), tx(',')] },
  { n:  7, tokens: [tx('  '), pr('status'), tx(': '), fn('"LIVE ✓"'), tx(',')] },
  { n:  8, tokens: [tx('  '), pr('url'), tx(': '), str('"capstoneid.id/convertimage/"'), tx(',')] },
  { n:  9, tokens: [tx('};')] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [cm('// 다양한 이미지 포맷을')] },
  { n: 12, tokens: [cm('// 간편하게 변환하는 컨버터')] },
];

const ALL_WORKS: WorkItem[] = [
  { lines: notionLines,         filename: 'notion_template.js',       status: 'LIVE', href: 'https://www.notion.com/ko/@capstone' },
  { lines: promptLines,         filename: 'prompt_generator_2.0.js',      status: 'LIVE', href: 'https://sinhumanprompt.figma.site' },
  { lines: handParticlesLines,  filename: 'camera_hand_particles.js', status: 'LIVE', href: 'https://sinhandparticles.figma.site/' },
  { lines: mouseParticlesLines, filename: 'mouse_particles.js',       status: 'LIVE', href: 'https://sindpparticles.figma.site/' },
  { lines: shredImgLines,       filename: 'image_shredder.js',        status: 'LIVE', href: 'https://sinshredimg.figma.site/' },
  { lines: consultingLines,     filename: 'consulting_process.js',    status: 'LIVE', href: 'https://capstone-id-info.notion.site/31dfcc99237780b4ae8bc1c5cec1f82b?source=copy_link' },
  { lines: mbtiFormLines,       filename: 'mbti_form.js',             status: 'LIVE', href: 'https://sinmbtiform.figma.site' },
  { lines: neumoLines,          filename: 'neumorphism_ui.js',        status: 'LIVE', href: 'https://sinuidesign.figma.site/' },
  { lines: clockLines,          filename: 'diglog_clock.js',          status: 'LIVE', href: 'https://sindiglogclock.figma.site/' },
  { lines: faceEmotionLines,    filename: 'face_emotion.js',          status: 'LIVE', href: 'https://sinfaceemotion.figma.site' },
  { lines: windParticlesLines,  filename: 'wind_particles.js',        status: 'LIVE', href: 'https://sinwindwind.figma.site/' },
  { lines: discordAnsiLines,    filename: 'discord_ansi.js',          status: 'LIVE', href: 'https://sindisansi.figma.site/' },
  { lines: textUniTransLines,   filename: 'text_uni_trans.js',        status: 'LIVE', href: 'https://textunitrans.figma.site/' },
  { lines: vibeFormLines,       filename: 'vibe_form.js',             status: 'LIVE', href: 'https://capstoneid.github.io/sinvibeform/' },
  { lines: shoppingMovieLines,  filename: 'shopping_movie.js',        status: 'STOP', href: 'https://claude.ai/public/artifacts/664680e9-56d7-44d2-a129-833870db72db' },
  { lines: mp4ToGifLines,       filename: 'mp4_to_gif_converter.js',  status: 'LIVE', href: 'https://capstoneid.github.io/sinconvertmp4togif/' },
  { lines: convertImageLines,   filename: 'image_convert.js',         status: 'LIVE', href: 'https://capstoneid.github.io/convertimage/' },
];

/* ─── CodeCard 컴포넌트 ─── */

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

export function WorksSection() {
  const [activeTab, setActiveTab] = useState<TabType>('LIVE');

  const liveCount = ALL_WORKS.filter(w => w.status === 'LIVE').length;
  const stopCount = ALL_WORKS.filter(w => w.status === 'STOP').length;

  const counts: Record<TabType, number> = {
    ALL:  ALL_WORKS.length,
    LIVE: liveCount,
    STOP: stopCount,
  };

  const filtered = activeTab === 'ALL'
    ? ALL_WORKS
    : ALL_WORKS.filter(w => w.status === activeTab);

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
      <div className="works-grid">
        {filtered.map(work => (
          <CodeCard key={work.filename} {...work} />
        ))}
      </div>
    </section>
  );
}
