create table if not exists public.odds_movements (
  id bigint generated always as identity primary key,
  game_id text not null,
  market_type text not null check (market_type in ('moneyline', 'spread', 'total')),
  selection text not null check (selection in ('home', 'away', 'draw', 'over', 'under')),
  line_value numeric,
  old_odds numeric not null,
  new_odds numeric not null,
  changed_at timestamptz not null default now()
);

create index if not exists odds_movements_changed_at_idx
  on public.odds_movements (changed_at desc);
create index if not exists odds_movements_game_id_idx
  on public.odds_movements (game_id);

alter table public.odds_movements enable row level security;
drop policy if exists "Public can read odds movements" on public.odds_movements;
create policy "Public can read odds movements"
  on public.odds_movements for select
  using (true);

grant select on public.odds_movements to anon, authenticated;
grant all on public.odds_movements to service_role;
grant usage, select on sequence public.odds_movements_id_seq to service_role;
