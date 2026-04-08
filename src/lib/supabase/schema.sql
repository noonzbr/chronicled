-- ══════════════════════════════════════════════════
-- CHRONICLED — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ══════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES ─────────────────────────────────────────
-- Extends Supabase auth.users with display name
create table if not exists profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text not null,
  email       text not null,
  created_at  timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);


-- ── SESSIONS ─────────────────────────────────────────
-- One session = one book project
create table if not exists sessions (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references profiles(id) on delete cascade,
  book_slug     text not null,
  status        text not null default 'interviewing',
  -- status: interviewing | generating | preview | ordered | complete
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table sessions enable row level security;

create policy "Users can manage own sessions"
  on sessions for all using (auth.uid() = user_id);


-- ── MESSAGES ─────────────────────────────────────────
-- Interview transcript, message by message
create table if not exists messages (
  id          uuid default uuid_generate_v4() primary key,
  session_id  uuid references sessions(id) on delete cascade,
  role        text not null check (role in ('interviewer', 'user')),
  content     text not null,
  position    integer not null,
  created_at  timestamptz default now()
);

alter table messages enable row level security;

create policy "Users can manage own messages"
  on messages for all
  using (
    session_id in (
      select id from sessions where user_id = auth.uid()
    )
  );


-- ── BOOKS ────────────────────────────────────────────
-- Generated book content, stored per session
create table if not exists books (
  id              uuid default uuid_generate_v4() primary key,
  session_id      uuid references sessions(id) on delete cascade unique,
  title           text,
  dedication      text,
  chapter_1_title text,  chapter_1_body  text,
  chapter_2_title text,  chapter_2_body  text,
  chapter_3_title text,  chapter_3_body  text,
  chapter_4_title text,  chapter_4_body  text,
  chapter_5_title text,  chapter_5_body  text,
  chapter_6_title text,  chapter_6_body  text,
  epilogue_title  text,  epilogue_body   text,
  word_count      integer,
  created_at      timestamptz default now()
);

alter table books enable row level security;

create policy "Users can view own books"
  on books for all
  using (
    session_id in (
      select id from sessions where user_id = auth.uid()
    )
  );


-- ── PORTRAITS ────────────────────────────────────────
-- AI-generated Royal Portrait per session
create table if not exists portraits (
  id              uuid default uuid_generate_v4() primary key,
  session_id      uuid references sessions(id) on delete cascade unique,
  image_url       text,
  prompt_used     text,
  style           text,
  created_at      timestamptz default now()
);

alter table portraits enable row level security;

create policy "Users can view own portraits"
  on portraits for all
  using (
    session_id in (
      select id from sessions where user_id = auth.uid()
    )
  );


-- ── ORDERS ───────────────────────────────────────────
-- Purchase records
create table if not exists orders (
  id                  uuid default uuid_generate_v4() primary key,
  session_id          uuid references sessions(id) on delete cascade,
  user_id             uuid references profiles(id),
  tier                text not null check (tier in ('digital', 'softcover', 'hardcover')),
  amount_cents        integer not null,
  currency            text not null default 'usd',
  status              text not null default 'pending',
  -- status: pending | paid | processing | shipped | complete | refunded
  stripe_payment_id   text,
  stripe_session_id   text,
  download_token      uuid default uuid_generate_v4() unique,
  lulu_order_id       text,
  shipping_name       text,
  shipping_line1      text,
  shipping_line2      text,
  shipping_city       text,
  shipping_state      text,
  shipping_zip        text,
  shipping_country    text default 'US',
  pdf_url             text,
  tracking_number     text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table orders enable row level security;

create policy "Users can view own orders"
  on orders for all using (auth.uid() = user_id);


-- ── UPDATED_AT TRIGGER ───────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sessions_updated_at
  before update on sessions
  for each row execute function update_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ── MIGRATION: add download_token to orders ──────────
-- Run this if you already ran the schema above:
-- alter table orders add column if not exists download_token uuid default uuid_generate_v4() unique;

-- ── STORAGE BUCKET ───────────────────────────────────
-- Run this in Supabase Dashboard → Storage → New Bucket
-- Bucket name: "chronicled"  |  Public: true
-- Or via SQL:
-- insert into storage.buckets (id, name, public) values ('chronicled', 'chronicled', true);
-- create policy "Public read" on storage.objects for select using (bucket_id = 'chronicled');
-- create policy "Service write" on storage.objects for insert with check (bucket_id = 'chronicled');
