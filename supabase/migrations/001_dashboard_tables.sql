-- ─── Tables ───────────────────────────────────────────────────────────────────

create table if not exists public.whoop_data (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  recovery_score numeric,
  hrv           numeric,
  sleep_performance numeric,
  strain        numeric,
  time_in_bed   text,
  time_asleep   text,
  rem           text,
  synced_at     timestamptz default now()
);

create table if not exists public.dexa_scans (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  scan_date       date,
  body_fat_pct    numeric,
  lean_mass_lbs   numeric,
  bone_density    numeric,
  visceral_fat    numeric,
  next_scan_date  date
);

create table if not exists public.supplements (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  dose       text,
  timing     text,
  sort_order int default 0,
  active     boolean default true
);

create table if not exists public.nutrition_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  calories    int,
  protein_g   int,
  carbs_g     int,
  fat_g       int,
  notes       text,
  updated_at  timestamptz default now()
);

create table if not exists public.workout_plans (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  plan_content text,
  block_name   text,
  updated_at   timestamptz default now()
);

create table if not exists public.checkins (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  checkin_date  date,
  checkin_time  text,
  duration      text,
  format        text,
  agenda        text[]
);

-- ─── Row Level Security ────────────────────────────────────────────────────────

alter table public.whoop_data       enable row level security;
alter table public.dexa_scans       enable row level security;
alter table public.supplements      enable row level security;
alter table public.nutrition_plans  enable row level security;
alter table public.workout_plans    enable row level security;
alter table public.checkins         enable row level security;

-- whoop_data
create policy "Users read own whoop data"
  on public.whoop_data for select
  using (auth.uid() = user_id);

-- dexa_scans
create policy "Users read own dexa scans"
  on public.dexa_scans for select
  using (auth.uid() = user_id);

-- supplements
create policy "Users read own supplements"
  on public.supplements for select
  using (auth.uid() = user_id);

-- nutrition_plans
create policy "Users read own nutrition plan"
  on public.nutrition_plans for select
  using (auth.uid() = user_id);

-- workout_plans
create policy "Users read own workout plan"
  on public.workout_plans for select
  using (auth.uid() = user_id);

-- checkins
create policy "Users read own checkins"
  on public.checkins for select
  using (auth.uid() = user_id);
