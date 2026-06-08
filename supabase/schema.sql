create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  first_name text,
  conversation_tone text not null default 'warm',
  comfort_level integer not null default 5,
  interests text[] not null default '{}',
  subscription_tier text not null default 'free',
  created_at timestamptz not null default now()
);

create table if not exists event_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  context_key text not null,
  title text,
  audience_summary text,
  goal text,
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists generated_prompts (
  id uuid primary key default gen_random_uuid(),
  event_session_id uuid references event_sessions(id) on delete cascade,
  opener text not null,
  follow_up text not null,
  why_it_works text,
  source_type text not null default 'ai',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table event_sessions enable row level security;
alter table generated_prompts enable row level security;
