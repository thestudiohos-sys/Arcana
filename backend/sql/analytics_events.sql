create table if not exists public.analytics_events (
  id text primary key,
  event text not null check (event in (
    'premium_product_clicked',
    'checkout_opened',
    'payment_intent_clicked',
    'coming_soon_viewed',
    'launch_interest_clicked',
    'reading_started',
    'free_reading_completed'
  )),
  product_id text check (product_id in (
    'deep_reading',
    'lucky_numbers',
    'digital_talisman',
    'arcana_bundle'
  )),
  language text not null check (language in ('ko', 'en')),
  session_id varchar(128) not null,
  source varchar(64) not null,
  price_krw integer check (price_krw >= 0),
  price_usd numeric(12, 2) check (price_usd >= 0),
  client_timestamp timestamptz not null,
  created_at timestamptz not null default now(),
  constraint analytics_events_product_fields_check check (
    (
      event in (
        'premium_product_clicked',
        'checkout_opened',
        'payment_intent_clicked',
        'coming_soon_viewed',
        'launch_interest_clicked'
      )
      and product_id is not null
    )
    or
    (
      event in ('reading_started', 'free_reading_completed')
      and product_id is null
      and price_krw is null
      and price_usd is null
    )
  )
);

create index if not exists analytics_events_event_created_at_idx
  on public.analytics_events (event, created_at desc);

create index if not exists analytics_events_session_created_at_idx
  on public.analytics_events (session_id, created_at desc);

alter table public.analytics_events enable row level security;

revoke all on table public.analytics_events from anon, authenticated;

-- No browser-facing RLS policy is created. The FastAPI backend writes with the
-- Supabase service-role key, which remains server-side and bypasses RLS.
