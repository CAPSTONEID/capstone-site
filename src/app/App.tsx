import { useEffect, useState } from 'react';
import '../styles/capstone.css';
import { HeroCodeBlock } from './components/HeroCodeBlock';
import { WorksSection } from './components/WorksSection';

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);

  // ── Hero paragraph position controls ──
  const [heroP, setHeroP] = useState({
    marginTop: 1,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 41,
    fontSize: 16,
    lineHeight: 1.7,
  });
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="capstone-app">
      <header className="capstone-header">
        <div className="capstone-logo">
          <span>CAPSTONE</span> · 실무자
        </div>
        <nav>
          <ul className="capstone-nav">
            <li><a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>소개</a></li>
            <li><a href="#work" onClick={(e) => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); }}>작업</a></li>
            <li><a href="#tools" onClick={(e) => { e.preventDefault(); document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' }); }}>도구</a></li>
            <li><a href="#channels" onClick={(e) => { e.preventDefault(); document.getElementById('channels')?.scrollIntoView({ behavior: 'smooth' }); }}>채널</a></li>
            <li><a href="#works" onClick={(e) => { e.preventDefault(); document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' }); }}>포폴</a></li>
            <li>
              <button className="contact-nav-btn" onClick={() => setContactOpen(true)}>연락</button>
            </li>
          </ul>
        </nav>
      </header>

      {contactOpen && (
        <div className="contact-overlay" onClick={() => setContactOpen(false)}>
          <div className="contact-popup" onClick={e => e.stopPropagation()}>
            <button className="contact-popup-close" onClick={() => setContactOpen(false)}>✕</button>
            <div className="contact-popup-label">CONTACT</div>
            <h2 className="contact-popup-title">연락하기</h2>
            <div className="contact-popup-items">
              <a href="mailto:project@capstone.id" className="contact-popup-item">
                <span className="contact-popup-type">Mail</span>
                <span className="contact-popup-value">project@capstone.id</span>
                <span className="contact-popup-arrow">→</span>
              </a>
              <a href="https://www.instagram.com/id.capstone/" target="_blank" rel="noopener noreferrer" className="contact-popup-item">
                <span className="contact-popup-type">Instagram</span>
                <span className="contact-popup-value">@id.capstone</span>
                <span className="contact-popup-arrow">→</span>
              </a>
              <a href="https://capstone-id.notion.site/317fcc99237780a6ad9af4978e99e292?pvs=105" target="_blank" rel="noopener noreferrer" className="contact-popup-item">
                <span className="contact-popup-type">Inquiry</span>
                <span className="contact-popup-value">Submit an inquiry</span>
                <span className="contact-popup-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="capstone-hero px-[48px]">
        <div className="hero-bg-text">실무자</div>
        <div className="hero-eyebrow ml-[140px] mr-[0px] mt-[0px] mb-[24px]">AI × 시스템 × 콘텐츠</div>
        <div className="hero-bottom-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1 className="hero-title text-[64px] leading-[2.6] ml-[140px] mr-[0px] mt-[0px] mb-[32px]" style={{ fontFamily: "'Cafe24ClassicType', serif" }}>
              <em style={{color:'#BFFF3C'}}>실무</em>를<br /><em style={{color:'#BFFF3C'}}>설계</em>하는<br /><em style={{color:'#BFFF3C'}}>사람</em>
            </h1>
            <h3
              className="font-bold hero-subtitle"
              style={{
                color: '#ffffff',
                fontSize: `${heroP.fontSize}px`,
                lineHeight: heroP.lineHeight,
                textAlign: 'left',
                marginTop: `${heroP.marginTop}px`,
                marginRight: `${heroP.marginRight}px`,
                marginBottom: `${heroP.marginBottom}px`,
                marginLeft: `${heroP.marginLeft}px`,
                position: 'relative',
                left: '100px',
              }}
            >
              협업툴 및 AI 시스템 설계, AI 실무 적용,<br />
              바이브코딩 및 콘텐츠 프로세스 구축부터<br />
              반복되는 업무를 구조화해 더 빠르고 정확하게 실행합니다.
            </h3>
            <button
              className="capstone-btn btn-primary hero-channel-btn"
              onClick={() => document.getElementById('channels')?.scrollIntoView({ behavior: 'smooth' })}
            >
              운영채널 보기 →
            </button>
          </div>
          <HeroCodeBlock />
        </div>
      </section>

      <div className="capstone-divider"></div>

      {/* ── 01 소개 ── */}
      <section id="about" className="capstone-section">
        <div className="section-label">01 — 소개</div>
        <div className="about-grid reveal">
          <div className="about-quote">
            효과적인 기획이<br />생산성 높은 프로세스와<br />결과를 만든다
            <div className="about-contact">
              <div className="about-contact-item"><span>mail</span><span>project@capstone.id</span></div>
              <div className="about-contact-item"><span>instagram</span><span>instagram.com/id.capstone</span></div>
              <div className="about-contact-item"><span>youtube</span><span>youtube.com/@실무자</span></div>
            </div>
          </div>
          <div className="about-body !text-[13px] sm:!text-[15px] [&_br]:hidden sm:[&_br]:inline">
            <p>안녕하세요, <strong>실무자 — CAPSTONE</strong>입니다.</p>
            <p>마케팅·콘텐츠 전략과 AIㆍNotion 시스템 설계를 중심으로 활동하는<br /><strong>1인 크리에이터이자 실무 기획자</strong>입니다.</p>
            <p>브랜드의 비즈니스 목표를 달성하기 위한 <strong>전체 프로세스 설계</strong>부터<br /> 콘텐츠 제작, 광고 운영, 데이터 분석까지 퍼널 단위로 직접 기획하고 실행합니다.</p>
            <p>현재는 AI 서비스를 실무 파이프라인에 깊게 결합해 <br /><strong>프롬프트 엔지니어링</strong>과 <strong>AI 에이전트 활용</strong>을 통한 <br />업무 자동화를 지속적으로 연구·적용하고 있습니다.</p>
          </div>
        </div>
      </section>

      <div className="capstone-divider"></div>

      {/* ── 02 채널 소개 ── */}
      <section id="channels" className="capstone-section">
        <div className="section-label">02 — 채널 소개</div>
        <div className="channels-grid reveal">
          <div className="channel-card">
            <div className="channel-platform">YouTube</div>
            <div className="channel-name">@실무자</div>
            <p className="channel-desc">
              영상 촬영·편집, 각종 툴의 실무 활용법, AI 정보·팁, 업무 노하우를 다룹니다.
            </p>
            <a href="https://youtube.com/@실무자" target="_blank" rel="noopener noreferrer" className="capstone-btn btn-primary channel-card-btn">
              youtube.com/@실무자 →
            </a>
          </div>
          <div className="channel-card">
            <div className="channel-platform">Instagram</div>
            <div className="channel-name">@id.capstone</div>
            <p className="channel-desc">
              짧은 실무 팁, 작업 과정, 도구 활용 사례를 올립니다. 빠르게 스타일을 확인하기 좋습니다.
            </p>
            <a href="https://instagram.com/id.capstone" target="_blank" rel="noopener noreferrer" className="capstone-btn btn-primary channel-card-btn">
              instagram.com/id.capstone →
            </a>
          </div>
        </div>
        <div style={{ marginTop: '2px' }}>
          <div className="templates-card reveal">
            <div className="channel-platform">Notion</div>
            <div className="channel-name">Notion Template</div>
            <p className="channel-desc">
              제가 실제 업무에 쓰는 구조를 템플릿으로 만들어 공개·판매하고 있습니다. 무료 배포본도 있으니 먼저 열어보고 판단하세요.
            </p>
            <a href="https://notion.com/@capstone" target="_blank" rel="noopener noreferrer" className="capstone-btn btn-primary templates-card-btn mx-[0px] my-[32px]">
              notion.com/@capstone →
            </a>
          </div>
        </div>
      </section>

      <div className="capstone-divider"></div>

      {/* ── 03 저를 찾아 주세요 ── */}
      <section className="diagnosis-section capstone-section">
        <div className="section-label">03 — 저를 찾아 주세요</div>
        <div className="diag-grid reveal">
          <div className="diag-card diag-card-red">
            <div className="diag-indicator red"></div>
            <div className="diag-title red">이런 문제가 있어요.</div>
            <ul className="diag-list">
              <li>AI 툴은 많이 쓰데, 업무 흐름이 월활하지 않다.</li>
              <li>협업툴을 사용하는데 자료 아카이브용도가 되는 것 같다.</li>
              <li>콘텐츠나 프로젝트가 반복되는데, 매번 처음부터 다시 만들고 있다.</li>
              <li>어떤 툴을 써야 할지, 어떻게 연결해야 할지 모르겠다.</li>
              <li>작업은 많은데, 내가 지금 뭘 하고 있는지 한눈에 안 보인다.</li>
            </ul>
          </div>
          <div className="diag-card diag-card-green">
            <div className="diag-indicator green"></div>
            <div className="diag-title green">개선하고 싶어요.</div>
            <ul className="diag-list">
              <li>툴 추천이 아니라, 전체적인 흐름과 프로세스를 원한다</li>
              <li>실무 속도를 올리는 구조(시스템)의 디벨롭이 필요하다.</li>
              <li>AI를 보다 효과적으로 업무, 실무에 사용하고 싶다.</li>
              <li>협업툴 및 AI 서비스의 운영 도구써 활용이 필요하다.</li>
              <li>콘텐츠를 들 때 재사용·멀티유즈 구조를 향상하고 싶다.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="capstone-divider"></div>

      {/* ── 04 내가 실제로 하는 일 ── */}
      <section id="work" className="capstone-section">
        <div className="section-label">04 — 내가 실제로 하는 일</div>
        <div className="reveal">
          <table className="work-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>솔루션 제안</th>
              </tr>
            </thead>
            <tbody>
              <tr className="group transition-colors duration-300 cursor-default">
                <td className="transition-all duration-300 group-hover:!text-[#BFFF3C] relative before:absolute before:left-0 before:inset-y-0 before:w-[2px] before:bg-[#BFFF3C] before:scale-y-0 before:origin-top group-hover:before:scale-y-100 before:transition-transform before:duration-400">AI 활용</td>
                <td className="transition-colors duration-300 group-hover:!text-white group-hover:!bg-[#BFFF3C]/20">명확한 기획과 프로세스를 기반으로 업무 단계마다 AI가 고정된 루틴으로 작동되도록 설계</td>
              </tr>
              <tr className="group transition-colors duration-300 cursor-default">
                <td className="transition-all duration-300 group-hover:!text-[#BFFF3C] relative before:absolute before:left-0 before:inset-y-0 before:w-[2px] before:bg-[#BFFF3C] before:scale-y-0 before:origin-top group-hover:before:scale-y-100 before:transition-transform before:duration-400">바이브코딩</td>
                <td className="transition-colors duration-300 group-hover:!text-white group-hover:!bg-[#BFFF3C]/20">코드를 직접 작성하지 않고 AI와의 대화만으로 실동작하는 툴·자동화 스크립트·인터페이스를 즉시 구현 — 아이디어를 프로토타입으로 전환하는 속도를 극단적으로 단축</td>
              </tr>
              <tr className="group transition-colors duration-300 cursor-default">
                <td className="transition-all duration-300 group-hover:!text-[#BFFF3C] relative before:absolute before:left-0 before:inset-y-0 before:w-[2px] before:bg-[#BFFF3C] before:scale-y-0 before:origin-top group-hover:before:scale-y-100 before:transition-transform before:duration-400">운영 구조</td>
                <td className="transition-colors duration-300 group-hover:!text-white group-hover:!bg-[#BFFF3C]/20">다양한 업무들이 한 화면에서 흐름이 보이는 대시보드를 구성하여 업무 모니터링 및 편의성, 생산성, 효율성 증대</td>
              </tr>
              <tr className="group transition-colors duration-300 cursor-default">
                <td className="transition-all duration-300 group-hover:!text-[#BFFF3C] relative before:absolute before:left-0 before:inset-y-0 before:w-[2px] before:bg-[#BFFF3C] before:scale-y-0 before:origin-top group-hover:before:scale-y-100 before:transition-transform before:duration-400">콘텐츠 제작</td>
                <td className="transition-colors duration-300 group-hover:!text-white group-hover:!bg-[#BFFF3C]/20">반복적인 콘텐츠 제작은 규격·템플릿 기반으로 재사용 가능한 구조설계 / 크리에이티브 콘텐츠는 모드보드를 통한 효율적 제작</td>
              </tr>
              <tr className="group transition-colors duration-300 cursor-default">
                <td className="transition-all duration-300 group-hover:!text-[#BFFF3C] relative before:absolute before:left-0 before:inset-y-0 before:w-[2px] before:bg-[#BFFF3C] before:scale-y-0 before:origin-top group-hover:before:scale-y-100 before:transition-transform before:duration-400">의사결정</td>
                <td className="transition-colors duration-300 group-hover:!text-white group-hover:!bg-[#BFFF3C]/20">데이터 및 지표가 보이는 구조로 실험·개선 반복하여 의사결정을 효과적, 효율적으로 진급</td>
              </tr>
              <tr className="group transition-colors duration-300 cursor-default">
                <td className="transition-all duration-300 group-hover:!text-[#BFFF3C] relative before:absolute before:left-0 before:inset-y-0 before:w-[2px] before:bg-[#BFFF3C] before:scale-y-0 before:origin-top group-hover:before:scale-y-100 before:transition-transform before:duration-400">프로세스</td>
                <td className="transition-colors duration-300 group-hover:!text-white group-hover:!bg-[#BFFF3C]/20">선 기획 진행 후 프로세스를 노드화 하여 재현 가능한 규격으로 프로젝트의 진행 및 프로세스 설계</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="capstone-divider"></div>

      {/* ── 05 작업의 원칙 ── */}
      <section className="capstone-section">
        <div className="section-label">05 — 작업의 원칙</div>
        <div className="principles-grid">
          <div className="principle-card reveal">
            <div className="principle-num">PRINCIPLE / 01</div>
            <h3 className="principle-title">
              툴을 고르기 전에,<br />업무를 단계로 쪼갠다
            </h3>
            <p className="principle-body">
              어떤 툴이든 업무 단계가 먼저 정의되지 않으면, 그냥 메모장이 됩니다. 단계를 먼저 쪼개면, 어디에 무엇을 끼워 넣어야 할지가 보입니다.
            </p>
          </div>
          <div className="principle-card reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="principle-num">PRINCIPLE / 02</div>
            <h3 className="principle-title">
              프로세스 설계 전<br />기획이 중요하다
            </h3>
            <p className="principle-body">
              프로세스를 설계하고 기획을 하는 것이 아닌 기획을 진행하고 프로세스를 구축하여야 합니다.
            </p>
          </div>
          <div className="principle-card reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="principle-num">PRINCIPLE / 03</div>
            <h3 className="principle-title">
              설명보다 작동하는<br />예시를 먼저 보여준다
            </h3>
            <p className="principle-body">
              백 번 설명하는 것보다, 실제로 작동하는 예시 하나를 보여주는 게 낫습니다. 제가 만든 결과물을 직접 열어보고 판단하세요.
            </p>
          </div>
        </div>
      </section>

      <div className="capstone-divider"></div>

      {/* ── 06 다루는 도구 ── */}
      <section id="tools" className="capstone-section">
        <div className="section-label">06 — 다루는 도구</div>
        <div className="tools-grid reveal">
          <div className="tool-card">
            <div className="tool-category">AI Services</div>
            <div className="tool-list">Gemini · Claude · Grok · Higgsfield</div>
            <p className="tool-desc">→ 프롬프트 설계, 업무 단계 자동화, 콘텐츠 초안 생성</p>
          </div>
          <div className="tool-card">
            <div className="tool-category">Design & Collaboration</div>
            <div className="tool-list">Figma · Notion · Discord</div>
            <p className="tool-desc">→ 시스템 설계, 대시보드 구축, DB 설계, 팀 운영</p>
          </div>
        </div>
      </section>

      <div className="capstone-divider"></div>

      {/* ── 07 문의 및 연락 ── */}
      <section id="contact" className="contact-section reveal">
        <div className="section-label" style={{ justifyContent: 'center', marginBottom: '48px' }}>07 — 문의 및 연락</div>
        
        <p className="contact-sub">프로젝트 문의, 협업 제안, 강의 요청 모두 환영합니다.</p>
        <div className="contact-items-list">
          <a href="mailto:project@capstone.id" className="contact-list-item">
            <div className="flex flex-col flex-1 gap-[3px] sm:flex-row sm:items-center sm:gap-5">
              <span className="contact-list-type" style={{ width: 'auto' }}>Mail</span>
              <span className="contact-list-value">project@capstone.id</span>
            </div>
            <span className="contact-list-arrow" style={{ flexShrink: 0 }}>→</span>
          </a>
          <a href="https://www.instagram.com/id.capstone/" target="_blank" rel="noopener noreferrer" className="contact-list-item">
            <div className="flex flex-col flex-1 gap-[3px] sm:flex-row sm:items-center sm:gap-5">
              <span className="contact-list-type" style={{ width: 'auto' }}>Instagram</span>
              <span className="contact-list-value">@id.capstone</span>
            </div>
            <span className="contact-list-arrow" style={{ flexShrink: 0 }}>→</span>
          </a>
          <a href="https://capstone-id.notion.site/317fcc99237780a6ad9af4978e99e292?pvs=105" target="_blank" rel="noopener noreferrer" className="contact-list-item">
            <div className="flex flex-col flex-1 gap-[3px] sm:flex-row sm:items-center sm:gap-5">
              <span className="contact-list-type" style={{ width: 'auto' }}>Inquiry</span>
              <span className="contact-list-value">Submit an inquiry</span>
            </div>
            <span className="contact-list-arrow" style={{ flexShrink: 0 }}>→</span>
          </a>
        </div>
      </section>

      <div className="capstone-divider"></div>

      {/* ── 08 나의 작업물 ── */}
      <WorksSection />

      <div className="capstone-divider"></div>

      <footer className="capstone-footer">
        <span className="footer-text">Copyright ⓒ 2026 CAPSTONE All rights reserved.</span>
        <span className="footer-text">AI × Process × Vibe Codeing × Contents × Plan</span>
      </footer>

      {/* ── Inspector Panel ── */}
      

      {/* Floating works button */}
      <a className="contact-fab" href="#works" onClick={(e) => { e.preventDefault(); document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' }); }} aria-label="실무자의 바이브코딩" style={{ bottom: '88px', background: '#BFFF3C', color: '#0A0A0A' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
        <span className="contact-fab-label">실무자의 바이브코딩</span>
      </a>

      {/* Floating contact button */}
      <button className="contact-fab" onClick={() => setContactOpen(true)} aria-label="문의 및 연락하기" style={{ background: '#BFFF3C', color: '#0A0A0A' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span className="contact-fab-label">문의 및 연락하기</span>
      </button>
    </div>
  );
}
