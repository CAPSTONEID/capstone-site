import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mcavbnmmfyypcwmacoag.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_W2w6h-KxBp-FWXgqpWvu8A_OYb348NB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface WorkRecord {
  id: string;
  work_num: string;
  filename: string;
  status: 'LIVE' | 'STOP';
  href: string | null;
  sort_order: number;
  comment_top: string;
  type: string;
  category: string;
  url_display: string | null;
  url_is_locked: boolean;
  description_1: string | null;
  description_2: string | null;
  created_at: string;
  updated_at: string;
}

export type WorkInsert = Omit<WorkRecord, 'id' | 'created_at' | 'updated_at'>;
