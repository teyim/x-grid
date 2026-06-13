create extension if not exists "pgcrypto";

create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null,
  option text not null,
  rating int,
  message text,
  email text,
  route text,
  locale text,
  user_agent text,
  ip_hash text,
  posthog_distinct_id text,
  status text not null default 'new',
  constraint feedback_submissions_type_check
    check (type in ('feedback', 'bug', 'suggestion')),
  constraint feedback_submissions_option_check
    check (
      option in (
        'easy_to_use',
        'confusing',
        'design_feedback',
        'missing_feature',
        'upload_issue',
        'preview_issue',
        'download_issue',
        'mobile_layout_issue',
        'new_grid_type',
        'better_crop_zoom',
        'more_platforms',
        'seo_content_idea'
      )
    ),
  constraint feedback_submissions_rating_check
    check (rating is null or (rating >= 1 and rating <= 5)),
  constraint feedback_submissions_status_check
    check (status in ('new', 'reviewing', 'planned', 'closed')),
  constraint feedback_submissions_message_length_check
    check (message is null or char_length(message) <= 2000),
  constraint feedback_submissions_email_length_check
    check (email is null or char_length(email) <= 254),
  constraint feedback_submissions_route_length_check
    check (route is null or char_length(route) <= 500),
  constraint feedback_submissions_locale_length_check
    check (locale is null or char_length(locale) <= 32),
  constraint feedback_submissions_user_agent_length_check
    check (user_agent is null or char_length(user_agent) <= 500),
  constraint feedback_submissions_posthog_id_length_check
    check (posthog_distinct_id is null or char_length(posthog_distinct_id) <= 128)
);

alter table public.feedback_submissions enable row level security;

create index if not exists feedback_submissions_created_at_idx
  on public.feedback_submissions (created_at desc);

create index if not exists feedback_submissions_type_status_idx
  on public.feedback_submissions (type, status);

grant usage on schema public to service_role;
grant select, insert on public.feedback_submissions to service_role;
