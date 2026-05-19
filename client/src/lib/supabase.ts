import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ikfejoqvwmmqsuszpdhj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZmVqb3F2d21tcXN1c3pwZGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNDYzMDMsImV4cCI6MjA5NDcyMjMwM30.7PKHZhu7yjVvM1XyXguMuzB0EXwrksU-ZNL5iWycMts';

// Configure with in-memory storage — no localStorage/sessionStorage (blocked in iframe)
const inMemoryStorage: Record<string, string> = {};
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: {
      getItem: (key: string) => inMemoryStorage[key] ?? null,
      setItem: (key: string, value: string) => { inMemoryStorage[key] = value; },
      removeItem: (key: string) => { delete inMemoryStorage[key]; },
    },
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

// ---- SESSION ID (in-memory — no storage APIs allowed in iframe) ----
let _sessionId: string | null = null;
export function getSessionId(): string {
  if (!_sessionId) {
    _sessionId = crypto.randomUUID();
  }
  return _sessionId;
}

// ---- USER STATE PERSISTENCE ----
export async function getUserState(sessionId: string) {
  const { data } = await supabase
    .from('user_states')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  return data;
}

export async function upsertUserState(sessionId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('user_states')
    .upsert({ session_id: sessionId, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'session_id' })
    .select()
    .single();
  return { data, error };
}

// ---- PROMPT SESSIONS ----
export async function savePromptSession(sessionId: string, record: Record<string, any>) {
  const { data, error } = await supabase
    .from('prompt_sessions')
    .insert({ session_id: sessionId, ...record })
    .select()
    .single();
  return { data, error };
}

export async function saveReversePromptSession(sessionId: string, record: Record<string, any>) {
  const { data, error } = await supabase
    .from('reverse_prompt_sessions')
    .insert({ session_id: sessionId, ...record })
    .select()
    .single();
  return { data, error };
}

// ---- INQUIRIES ----
export async function submitInquiry(inquiry: Record<string, any>) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert(inquiry)
    .select()
    .single();
  return { data, error };
}

// ---- PROJECTS (read) ----
export async function getProjects(category?: string) {
  let query = supabase.from('projects').select('*').order('featured_order', { ascending: true });
  if (category) query = query.eq('category', category);
  const { data } = await query;
  return data || [];
}

// ---- SERVICES (read) ----
export async function getServices(category?: string) {
  let query = supabase.from('services').select('*').eq('active', true);
  if (category) query = query.eq('category', category);
  const { data } = await query;
  return data || [];
}

// ---- ARTWORKS (read) ----
export async function getArtworks(series?: string) {
  let query = supabase.from('artworks').select('*').eq('published', true);
  if (series) query = query.eq('series', series);
  const { data } = await query;
  return data || [];
}
