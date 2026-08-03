alter table public.parlays
  add column if not exists is_auto_generated boolean not null default false;

comment on column public.parlays.is_auto_generated is
  'False for normal AI-selected parlays; true for the daily minimum-guarantee fallback.';

grant select on table public.parlays to anon, authenticated;
grant all privileges on table public.parlays to service_role;
