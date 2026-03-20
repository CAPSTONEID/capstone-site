# CAPSTONE.ID — Official Website

**www.capstone.id** | 실무를 설계하는 사람의 포트폴리오 사이트

---

## 개요

CAPSTONE.ID의 공식 웹사이트입니다. AI 활용, 바이브코딩, 프로세스 설계, 콘텐츠 제작 등의 실무 작업물과 채널을 소개합니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| 빌드 | Vite 6 |
| 프레임워크 | React 18 + React Router 7 |
| 스타일링 | Tailwind CSS 4 |
| UI 컴포넌트 | shadcn/ui (Radix UI 기반) |
| 애니메이션 | Motion, Embla Carousel |
| 아이콘 | Lucide React |

## 프로젝트 구조

```
capstone-site/
├── src/
│   ├── app/
│   │   ├── App.tsx                  # 메인 앱 컴포넌트 (전체 페이지 구성)
│   │   └── components/
│   │       ├── HeroCodeBlock.tsx    # 타이핑 애니메이션 코드 블록
│   │       ├── WorksSection.tsx     # 작업물 쇼케이스 섹션
│   │       └── ui/                  # shadcn/ui 컴포넌트 모음
│   ├── styles/
│   │   ├── index.css                # 스타일 진입점
│   │   ├── capstone.css             # 커스텀 Capstone 스타일
│   │   ├── fonts.css                # 폰트 정의
│   │   └── theme.css                # 디자인 토큰 (색상 변수 등)
│   └── main.tsx                     # React 앱 진입점
├── guidelines/
│   └── Guidelines.md                # AI 가이드라인
├── index.html
├── vite.config.ts
└── package.json
```

## 페이지 섹션

1. **Hero** — "실무를 설계하는 사람" 타이핑 애니메이션
2. **소개** — 자기소개 및 연락처
3. **채널** — YouTube, Instagram, Notion 채널 소개
4. **저를 찾아 주세요** — 문제/개선 진단 카드
5. **내가 실제로 하는 일** — AI 활용, 바이브코딩, 운영, 콘텐츠 등
6. **작업의 원칙** — 3가지 핵심 원칙
7. **다루는 도구** — AI 서비스, 디자인/협업 툴
8. **문의 및 연락** — 이메일, 인스타그램, Notion 문의 폼
9. **나의 작업물** — 14개 프로젝트 쇼케이스 (LIVE/STOP 필터)

## 개발 환경 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## 배포

GitHub Pages를 통해 배포됩니다. 도메인은 `CNAME` 파일에 `www.capstone.id`로 설정되어 있습니다.

---

© 2026 CAPSTONE All rights reserved.
