-- ─── Profiles table ────────────────────────────────────────────────────────────
-- Run this in the Supabase SQL editor or via the CLI.

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  age         int,
  weight_lbs  numeric,
  height_in   numeric,
  notes       text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- ─── If the table already exists, add the new columns ──────────────────────────
alter table public.profiles add column if not exists age        int;
alter table public.profiles add column if not exists weight_lbs numeric;
alter table public.profiles add column if not exists height_in  numeric;
alter table public.profiles add column if not exists notes      text;
