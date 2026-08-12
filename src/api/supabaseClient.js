import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const auth = {
  me: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
    return { ...user, ...profile };
  },
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    return data;
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  updateMe: async (updates) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase.from('users').upsert({ id: user.id, ...updates }).select().single();
    if (error) throw error;
    return data;
  },
};

export const ai = {
  invoke: async ({ prompt, response_json_schema, messages }) => {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, response_json_schema, messages })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'AI request failed');
    }
    const data = await response.json();
    return data.result;
  }
};

function createEntity(tableName) {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };
  return {
    list: async (orderBy = '-created_at', limit = 200) => {
      let query = supabase.from(tableName).select('*');
      if (orderBy) {
        const desc = orderBy.startsWith('-');
        query = query.order(desc ? orderBy.slice(1) : orderBy, { ascending: !desc });
      }
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    filter: async (filters = {}) => {
      let query = supabase.from(tableName).select('*');
      Object.entries(filters).forEach(([k, v]) => { query = query.eq(k, v); });
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    get: async (id) => {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    create: async (record) => {
      const user = await getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.from(tableName)
        .insert({ ...record, user_id: user.id, created_by: user.email })
        .select().single();
      if (error) throw error;
      return data;
    },
    update: async (id, updates) => {
      const { data, error } = await supabase.from(tableName).update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    }
  };
}

export const entities = {
  AthleteProfile: createEntity('athlete_profiles'),
  AthleteTest: createEntity('athlete_tests'),
  CoachConnection: createEntity('coach_connections'),
  Exercise: createEntity('exercises'),
  Routine: createEntity('routines'),
  WorkoutLog: createEntity('workout_logs'),
  CoachRoutine: createEntity('coach_routines'),
  CoachAlert: createEntity('coach_alerts'),
};
