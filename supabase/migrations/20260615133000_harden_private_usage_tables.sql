-- Keep dashboard and feedback data server-only. The app reads/writes these
-- tables through the Supabase service role from Next.js API routes.

alter table public.feedback_submissions enable row level security;
alter table public.feedback_submissions force row level security;

alter table public.usage_counters enable row level security;
alter table public.usage_counters force row level security;

alter table public.usage_events enable row level security;
alter table public.usage_events force row level security;

revoke all on table public.feedback_submissions from public;
revoke all on table public.feedback_submissions from anon;
revoke all on table public.feedback_submissions from authenticated;

revoke all on table public.usage_counters from public;
revoke all on table public.usage_counters from anon;
revoke all on table public.usage_counters from authenticated;

revoke all on table public.usage_events from public;
revoke all on table public.usage_events from anon;
revoke all on table public.usage_events from authenticated;

revoke all on function public.record_grid_usage(text, int, int) from public;
revoke all on function public.record_grid_usage(text, int, int) from anon;
revoke all on function public.record_grid_usage(text, int, int) from authenticated;

grant select, insert on table public.feedback_submissions to service_role;
grant select, update on table public.usage_counters to service_role;
grant select, insert on table public.usage_events to service_role;
grant execute on function public.record_grid_usage(text, int, int) to service_role;
