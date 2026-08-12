-- Fahrtenbuch: Tabellen + Row Level Security (jeder User sieht nur seine eigenen Daten)
-- Einmalig im Supabase Dashboard unter "SQL Editor" ausführen.

create table if not exists public.trips (
  id text primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  datum date not null,
  stops jsonb not null,
  kms jsonb not null,
  start text not null,
  ziel text not null,
  distanz_einfach numeric not null,
  hin_und_zurueck boolean not null,
  rueckfahrt_km numeric,
  gesamt numeric not null,
  notiz text,
  created_at timestamptz not null default now()
);
alter table public.trips enable row level security;
create policy "trips_owner" on public.trips
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.adressen (
  id text primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null,
  adresse text not null
);
alter table public.adressen enable row level security;
create policy "adressen_owner" on public.adressen
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.routen (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  route_key text not null,
  km numeric not null,
  primary key (user_id, route_key)
);
alter table public.routen enable row level security;
create policy "routen_owner" on public.routen
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.geocode_cache (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  adresse text not null,
  lat double precision not null,
  lon double precision not null,
  primary key (user_id, adresse)
);
alter table public.geocode_cache enable row level security;
create policy "geocode_owner" on public.geocode_cache
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
