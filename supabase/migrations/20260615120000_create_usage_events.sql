create extension if not exists "pgcrypto";

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  platform text,
  mode_id text,
  mode_label text,
  tile_count int,
  input_image_count int,
  fit_mode text,
  route text,
  locale text,
  country_code text,
  country_name text,
  constraint usage_events_event_type_check
    check (event_type in ('tool_started', 'grid_created', 'download_started')),
  constraint usage_events_platform_check
    check (platform is null or platform in ('x', 'instagram')),
  constraint usage_events_tile_count_check
    check (tile_count is null or (tile_count >= 1 and tile_count <= 100)),
  constraint usage_events_input_image_count_check
    check (input_image_count is null or (input_image_count >= 1 and input_image_count <= 100)),
  constraint usage_events_fit_mode_check
    check (fit_mode is null or fit_mode in ('cover', 'contain')),
  constraint usage_events_route_length_check
    check (route is null or char_length(route) <= 500),
  constraint usage_events_locale_length_check
    check (locale is null or char_length(locale) <= 32),
  constraint usage_events_country_code_length_check
    check (country_code is null or char_length(country_code) <= 8),
  constraint usage_events_country_name_length_check
    check (country_name is null or char_length(country_name) <= 120),
  constraint usage_events_mode_id_length_check
    check (mode_id is null or char_length(mode_id) <= 64),
  constraint usage_events_mode_label_length_check
    check (mode_label is null or char_length(mode_label) <= 120)
);

alter table public.usage_events enable row level security;

create index if not exists usage_events_created_at_idx
  on public.usage_events (created_at desc);

create index if not exists usage_events_event_created_idx
  on public.usage_events (event_type, created_at desc);

create index if not exists usage_events_platform_created_idx
  on public.usage_events (platform, created_at desc);

create index if not exists usage_events_mode_created_idx
  on public.usage_events (mode_id, created_at desc);

create index if not exists usage_events_country_created_idx
  on public.usage_events (country_code, created_at desc);

grant usage on schema public to service_role;
grant select, insert on public.usage_events to service_role;
