import type { WorkRecord } from './supabase';

type Token = { color: string; text: string };
interface WorkCodeLine { n: number; tokens: Token[] }

const kw  = (t: string): Token => ({ color: '#ff79c6', text: t });
const str = (t: string): Token => ({ color: '#d4ff47', text: t });
const fn  = (t: string): Token => ({ color: '#bfff3c', text: t });
const pr  = (t: string): Token => ({ color: '#8be9fd', text: t });
const cm  = (t: string): Token => ({ color: '#6272a4', text: t });
const nm  = (t: string): Token => ({ color: '#bd93f9', text: t });
const tx  = (t: string): Token => ({ color: '#f8f8f2', text: t });
const red = (t: string): Token => ({ color: '#ff5555', text: t });

export function generateLines(work: WorkRecord): WorkCodeLine[] {
  const statusToken = work.status === 'LIVE' ? fn('"LIVE ✓"') : red('"STOP ✗"');
  const urlToken = work.url_is_locked
    ? red('"🔒 보안페이지"')
    : str(`"${work.url_display ?? ''}"`);

  const lines: WorkCodeLine[] = [
    { n: 1,  tokens: [cm(`// ${work.comment_top}`)] },
    { n: 2,  tokens: [] },
    { n: 3,  tokens: [kw('const'), tx(' '), nm(work.work_num), tx(' = {')] },
    { n: 4,  tokens: [tx('  '), pr('type'),     tx(': '), str(`"${work.type}"`),     tx(',')] },
    { n: 5,  tokens: [tx('  '), pr('creator'),  tx(': '), str('"CAPSTONE"'),          tx(',')] },
    { n: 6,  tokens: [tx('  '), pr('category'), tx(': '), str(`"${work.category}"`), tx(',')] },
    { n: 7,  tokens: [tx('  '), pr('status'),   tx(': '), statusToken,                tx(',')] },
    { n: 8,  tokens: [tx('  '), pr('url'),      tx(': '), urlToken,                   tx(',')] },
    { n: 9,  tokens: [tx('};')] },
    { n: 10, tokens: [] },
  ];

  if (work.description_1) {
    lines.push({ n: 11, tokens: [cm(`// ${work.description_1}`)] });
  }
  if (work.description_2) {
    lines.push({ n: 12, tokens: [cm(`// ${work.description_2}`)] });
  }

  return lines;
}

export type { WorkCodeLine, Token };
