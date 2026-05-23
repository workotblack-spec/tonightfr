
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  venue text not null,
  area text not null,
  category text not null,
  starts_at timestamptz not null,
  image_key text not null,
  price_text text,
  description text,
  lineup text,
  address text,
  lat double precision,
  lng double precision,
  ticket_url text,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Events are viewable by everyone"
  on public.events for select
  using (true);

create index events_starts_at_idx on public.events (starts_at);
create index events_category_idx on public.events (category);
