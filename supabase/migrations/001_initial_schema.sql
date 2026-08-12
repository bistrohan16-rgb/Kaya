-- AthleteRx Database Schema
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- ─── USERS ───────────────────────────────────────────────────
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  subscription_plan text default 'free' check (subscription_plan in ('free', 'premium', 'coach')),
  coach_code text unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can read own record" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own record" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own record" on public.users
  for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── ATHLETE PROFILES ────────────────────────────────────────
create table public.athlete_profiles (
  id uuid default uuid_generate_v4() primary key,
  created_by text,
  user_id uuid references auth.users(id) on delete cascade,
  sport text,
  age integer,
  height_cm numeric,
  weight_kg numeric,
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced', 'professional')),
  injury_history jsonb default '[]',
  current_concerns text[] default '{}',
  goals text[] default '{}',
  training_days_per_week integer,
  mode text check (mode in ('injury', 'prehab')),
  injured_area text,
  injury_severity text check (injury_severity in ('mild', 'moderate', 'severe')),
  injury_description text,
  position text,
  return_to_sport_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.athlete_profiles enable row level security;

create policy "Athletes manage own profile" on public.athlete_profiles
  for all using (auth.uid()::text = user_id::text or created_by = auth.jwt()->>'email');

-- ─── EXERCISES ───────────────────────────────────────────────
create table public.exercises (
  id uuid default uuid_generate_v4() primary key,
  created_by text,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  target_areas text[] default '{}',
  sports text[] default '{}',
  type text check (type in ('stretch', 'strength', 'mobility', 'balance', 'activation', 'foam_roll')),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  duration_seconds integer,
  reps integer,
  sets integer,
  equipment_needed text[] default '{}',
  video_url text,
  image_url text,
  injury_prevention_for text[] default '{}',
  rehab_for text[] default '{}',
  created_at timestamptz default now()
);

alter table public.exercises enable row level security;

create policy "Users manage own exercises" on public.exercises
  for all using (auth.uid() = user_id or created_by = auth.jwt()->>'email');

-- ─── ROUTINES ────────────────────────────────────────────────
create table public.routines (
  id uuid default uuid_generate_v4() primary key,
  created_by text,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  type text check (type in ('prehab', 'rehab', 'warmup', 'cooldown', 'recovery')),
  sport text,
  focus_areas text[] default '{}',
  exercises jsonb default '[]',
  estimated_duration_minutes integer,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  is_custom boolean default false,
  created_at timestamptz default now()
);

alter table public.routines enable row level security;

create policy "Users manage own routines" on public.routines
  for all using (auth.uid() = user_id or created_by = auth.jwt()->>'email');

-- ─── COACH CONNECTIONS ───────────────────────────────────────
create table public.coach_connections (
  id uuid default uuid_generate_v4() primary key,
  coach_id text not null,
  athlete_id text,
  athlete_email text not null,
  athlete_name text,
  status text default 'pending' check (status in ('pending', 'active', 'removed')),
  connected_at timestamptz,
  assigned_routines jsonb default '[]',
  created_at timestamptz default now()
);

alter table public.coach_connections enable row level security;

create policy "Coaches manage own connections" on public.coach_connections
  for all using (coach_id = auth.uid()::text);

create policy "Athletes see own connections" on public.coach_connections
  for select using (athlete_email = auth.jwt()->>'email');

create policy "Athletes can create connection requests" on public.coach_connections
  for insert with check (athlete_email = auth.jwt()->>'email');

-- ─── WORKOUT LOGS ────────────────────────────────────────────
create table public.workout_logs (
  id uuid default uuid_generate_v4() primary key,
  created_by text,
  user_id uuid references auth.users(id) on delete cascade,
  athlete_email text,
  routine_id uuid,
  routine_name text,
  completed_at timestamptz,
  duration_minutes integer,
  exercises_completed jsonb default '[]',
  overall_feeling text check (overall_feeling in ('great', 'good', 'okay', 'tired', 'painful')),
  notes text,
  created_at timestamptz default now()
);

alter table public.workout_logs enable row level security;

create policy "Users manage own logs" on public.workout_logs
  for all using (auth.uid() = user_id or created_by = auth.jwt()->>'email');

create policy "Coaches can read athlete logs" on public.workout_logs
  for select using (
    exists (
      select 1 from public.coach_connections cc
      where cc.coach_id = auth.uid()::text
      and cc.athlete_email = workout_logs.athlete_email
      and cc.status = 'active'
    )
  );

-- ─── ATHLETE TESTS ───────────────────────────────────────────
create table public.athlete_tests (
  id uuid default uuid_generate_v4() primary key,
  created_by text,
  user_id uuid references auth.users(id) on delete cascade,
  athlete_id text,
  athlete_email text,
  coach_id text,
  test_date date not null,
  mile_time_seconds numeric,
  sprint_100m_seconds numeric,
  broad_jump_cm numeric,
  bronco_time_seconds numeric,
  vertical_jump_cm numeric,
  beep_test_level numeric,
  pushups integer,
  situps integer,
  flexibility_cm numeric,
  notes text,
  created_at timestamptz default now()
);

alter table public.athlete_tests enable row level security;

create policy "Athletes manage own tests" on public.athlete_tests
  for all using (auth.uid() = user_id or created_by = auth.jwt()->>'email' or athlete_email = auth.jwt()->>'email');

create policy "Coaches can manage athlete tests" on public.athlete_tests
  for all using (
    coach_id = auth.uid()::text or
    exists (
      select 1 from public.coach_connections cc
      where cc.coach_id = auth.uid()::text
      and cc.athlete_email = athlete_tests.athlete_email
      and cc.status = 'active'
    )
  );

-- COACH ROUTINES (custom routines built by coaches)
create table public.coach_routines (
  id uuid default uuid_generate_v4() primary key,
  created_by text,
  user_id uuid references auth.users(id) on delete cascade,
  coach_id text,
  name text not null,
  description text,
  type text,
  sport text,
  difficulty text,
  estimated_duration_minutes integer,
  exercises jsonb default '[]',
  focus_areas text[] default '{}',
  created_at timestamptz default now()
);
alter table public.coach_routines enable row level security;
create policy "Coaches manage own routines" on public.coach_routines
  for all using (auth.uid() = user_id or created_by = auth.jwt()->>'email');

-- COACH ALERTS
create table public.coach_alerts (
  id uuid default uuid_generate_v4() primary key,
  coach_id text not null,
  athlete_email text not null,
  athlete_name text,
  exercise_name text,
  pain_level integer,
  session_date timestamptz,
  alert_type text default 'pain',
  is_read boolean default false,
  created_at timestamptz default now()
);
alter table public.coach_alerts enable row level security;
create policy "Coaches see own alerts" on public.coach_alerts
  for all using (coach_id = auth.uid()::text);
