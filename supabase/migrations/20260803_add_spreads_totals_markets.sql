alter table public.games
  add column if not exists home_spread_point numeric,
  add column if not exists away_spread_point numeric,
  add column if not exists home_spread_odds numeric,
  add column if not exists away_spread_odds numeric,
  add column if not exists total_point numeric,
  add column if not exists over_odds numeric,
  add column if not exists under_odds numeric;

alter table public.picks
  add column if not exists market_type text not null default 'moneyline',
  add column if not exists line_value numeric;

do $$
declare constraint_name text;
begin
  for constraint_name in
    select conname from pg_constraint
    where conrelid = 'public.picks'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%pick_type%'
  loop
    execute format('alter table public.picks drop constraint %I', constraint_name);
  end loop;
end $$;

alter table public.picks drop constraint if exists picks_market_type_check;
alter table public.picks add constraint picks_market_type_check
  check (market_type in ('moneyline', 'spread', 'total'));

alter table public.picks add constraint picks_pick_type_markets_check
  check (pick_type in ('home_win', 'away_win', 'draw', 'home_spread', 'away_spread', 'over', 'under'));

alter table public.picks drop constraint if exists picks_market_line_check;
alter table public.picks add constraint picks_market_line_check
  check ((market_type = 'moneyline' and line_value is null) or (market_type in ('spread', 'total') and line_value is not null));

grant select on table public.games, public.picks to anon, authenticated;
grant all privileges on table public.games, public.picks to service_role;

notify pgrst, 'reload schema';
