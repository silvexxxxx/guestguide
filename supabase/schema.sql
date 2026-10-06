-- ========================================================
-- GUESTGUIDE - DATABASE SCHEMA & LICENSING SYSTEM
-- Esegui questo script nel "SQL Editor" di Supabase
-- ========================================================

-- Abilita estensione UUID
create extension if not exists "uuid-ossp";

-- 1. TABELLA SOTTOSCRIZIONI E LICENZE HOST (Con SuperAdmin Override)
create table if not exists public.host_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  email text not null,
  role text default 'host' check (role in ('host', 'superadmin')),
  access_type text not null default 'free_trial' check (access_type in (
    'free_trial',    -- Prova gratuita 14 giorni
    'lemonsqueezy',  -- Abbonamento Lemon Squeezy
    'manual_grant',  -- Accesso regalato a tempo (es. 5 anni)
    'lifetime'       -- Accesso a vita illimitato
  )),
  valid_until timestamp with time zone default (now() + interval '14 days'),
  max_properties integer default 1,
  is_active boolean default true,
  admin_notes text default '',
  ls_customer_id text,
  ls_subscription_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. TABELLA PROPRIETÀ
create table if not exists public.properties (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text default '',
  host_name text default '',
  host_phone text default '',
  host_photo_url text default '',
  wifi_name text default '',
  wifi_password text default '',
  checkin_time text default '15:00',
  checkout_time text default '10:00',
  checkin_instructions jsonb default '{}'::jsonb,
  checkout_instructions jsonb default '{}'::jsonb,
  welcome_text jsonb default '{}'::jsonb,
  address text default '',
  city text default '',
  admin_pin text default '1234',
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. TABELLA REGOLE DELLA CASA
create table if not exists public.house_rules (
  id text primary key default gen_random_uuid()::text,
  property_id text references public.properties(id) on delete cascade not null,
  icon text not null,
  label jsonb default '{}'::jsonb,
  sort_order integer default 0
);

-- 4. TABELLA LUOGHI CONSIGLIATI
create table if not exists public.local_places (
  id text primary key default gen_random_uuid()::text,
  property_id text references public.properties(id) on delete cascade not null,
  category text not null check (category in ('restaurant', 'bar', 'supermarket', 'attraction', 'pharmacy')),
  name text not null,
  address text default '',
  description jsonb default '{}'::jsonb,
  maps_url text default '',
  phone text default '',
  sort_order integer default 0
);

-- 5. TABELLA TRANSAZIONI & FINANZE (Riservata all'Host)
create table if not exists public.transactions (
  id text primary key default gen_random_uuid()::text,
  property_id text references public.properties(id) on delete cascade not null,
  date text not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  description text not null,
  amount numeric(10, 2) not null default 0,
  notes text default '',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ========================================================
-- SICUREZZA RLS (ROW LEVEL SECURITY)
-- ========================================================
alter table public.host_subscriptions enable row level security;
alter table public.properties enable row level security;
alter table public.house_rules enable row level security;
alter table public.local_places enable row level security;
alter table public.transactions enable row level security;

-- POLICIES: PROPRIETÀ
-- Chiunque (ospiti) può leggere le proprietà pubbliche
create policy "Lettura pubblica proprietà" on public.properties
  for select using (is_public = true);

-- Solo l'host proprietario può modificare o cancellare la sua casa
create policy "Gestione proprietario proprietà" on public.properties
  for all using (auth.uid() = user_id);

-- POLICIES: REGOLE DELLA CASA
create policy "Lettura pubblica regole" on public.house_rules
  for select using (true);

create policy "Gestione proprietario regole" on public.house_rules
  for all using (
    exists (
      select 1 from public.properties
      where properties.id = house_rules.property_id
      and properties.user_id = auth.uid()
    )
  );

-- POLICIES: LUOGHI CONSIGLIATI
create policy "Lettura pubblica luoghi" on public.local_places
  for select using (true);

create policy "Gestione proprietario luoghi" on public.local_places
  for all using (
    exists (
      select 1 from public.properties
      where properties.id = local_places.property_id
      and properties.user_id = auth.uid()
    )
  );

-- POLICIES: TRANSAZIONI FINANZIARIE (MAI visibili agli ospiti)
create policy "Gestione riservata finanze host" on public.transactions
  for all using (
    exists (
      select 1 from public.properties
      where properties.id = transactions.property_id
      and properties.user_id = auth.uid()
    )
  );

-- POLICIES: SOTTOSCRIZIONI
create policy "Host legge propria sottoscrizione" on public.host_subscriptions
  for select using (auth.uid() = user_id);

-- ========================================================
-- TRIGGER: Crea automaticamente prova gratuita a ogni registrazione
-- ========================================================
create or replace function public.handle_new_host()
returns trigger as $$
begin
  insert into public.host_subscriptions (user_id, email, access_type, valid_until)
  values (new.id, new.email, 'free_trial', now() + interval '14 days');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_host();
