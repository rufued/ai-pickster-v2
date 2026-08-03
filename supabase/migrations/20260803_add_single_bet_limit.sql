alter table public.picks
  add column if not exists is_single_bet boolean not null default true;

create index if not exists picks_daily_single_bet_idx
  on public.picks (ai_model, created_at desc)
  where is_single_bet = true;

comment on column public.picks.is_single_bet is
  'True when the pick is also placed as a standalone wager; false when it is analysis used only as a parlay leg.';

grant select on table public.picks to anon, authenticated;
grant all privileges on table public.picks to service_role;

notify pgrst, 'reload schema';
