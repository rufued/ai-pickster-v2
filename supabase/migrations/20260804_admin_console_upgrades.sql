-- Adds pick/parlay cancellation support (SHadmin bet cancel + rebet) and
-- community board admin authorship (operator posts + optional pin).

alter table public.picks
  add column if not exists status text not null default 'active';

alter table public.picks
  drop constraint if exists picks_status_check;
alter table public.picks
  add constraint picks_status_check check (status in ('active', 'cancelled'));

create index if not exists picks_status_idx on public.picks (status);
create index if not exists picks_ai_model_game_status_idx
  on public.picks (ai_model, game_id, status);

alter table public.parlays
  drop constraint if exists parlays_status_check;
alter table public.parlays
  add constraint parlays_status_check check (status in ('pending', 'won', 'lost', 'cancelled'));

alter table public.community_posts
  add column if not exists is_admin boolean not null default false;
alter table public.community_posts
  add column if not exists is_pinned boolean not null default false;

create index if not exists community_posts_pinned_created_at_idx
  on public.community_posts (is_pinned desc, created_at desc);
