create table if not exists public.usage_counters (
  metric text primary key,
  value bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint usage_counters_metric_check
    check (
      metric in (
        'total_grids_created',
        'total_images_transformed',
        'total_tiles_generated',
        'x_grids_created',
        'instagram_grids_created'
      )
    ),
  constraint usage_counters_value_check check (value >= 0)
);

insert into public.usage_counters (metric, value)
values
  ('total_grids_created', 0),
  ('total_images_transformed', 0),
  ('total_tiles_generated', 0),
  ('x_grids_created', 0),
  ('instagram_grids_created', 0)
on conflict (metric) do nothing;

alter table public.usage_counters enable row level security;

create or replace function public.record_grid_usage(
  platform_value text,
  tile_count_value int,
  input_image_count_value int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if platform_value not in ('x', 'instagram') then
    raise exception 'Invalid platform';
  end if;

  if tile_count_value < 1 or tile_count_value > 100 then
    raise exception 'Invalid tile count';
  end if;

  if input_image_count_value < 1 or input_image_count_value > 100 then
    raise exception 'Invalid image count';
  end if;

  update public.usage_counters
  set value = value + 1,
      updated_at = now()
  where metric = 'total_grids_created';

  update public.usage_counters
  set value = value + input_image_count_value,
      updated_at = now()
  where metric = 'total_images_transformed';

  update public.usage_counters
  set value = value + tile_count_value,
      updated_at = now()
  where metric = 'total_tiles_generated';

  update public.usage_counters
  set value = value + 1,
      updated_at = now()
  where metric = case
    when platform_value = 'instagram' then 'instagram_grids_created'
    else 'x_grids_created'
  end;
end;
$$;

grant usage on schema public to service_role;
grant select, update on public.usage_counters to service_role;
grant execute on function public.record_grid_usage(text, int, int) to service_role;
