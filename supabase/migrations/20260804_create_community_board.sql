create extension if not exists pgcrypto;

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('free', 'game_analysis', 'ai_discussion')),
  title text not null check (char_length(title) between 1 and 120),
  content text not null check (char_length(content) between 1 and 10000),
  nickname text not null check (char_length(nickname) between 2 and 30),
  password_hash text not null,
  author_ip_hash text not null,
  comment_count integer not null default 0 check (comment_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  nickname text not null check (char_length(nickname) between 2 and 30),
  password_hash text not null,
  author_ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists community_posts_created_at_idx on public.community_posts(created_at desc);
create index if not exists community_posts_category_created_at_idx on public.community_posts(category, created_at desc);
create index if not exists community_posts_ip_created_at_idx on public.community_posts(author_ip_hash, created_at desc);
create index if not exists community_comments_post_created_at_idx on public.community_comments(post_id, created_at asc);
create index if not exists community_comments_ip_created_at_idx on public.community_comments(author_ip_hash, created_at desc);

create or replace function public.community_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists community_posts_updated_at on public.community_posts;
create trigger community_posts_updated_at before update on public.community_posts
for each row execute function public.community_set_updated_at();

create or replace function public.community_sync_comment_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts set comment_count = comment_count + 1 where id = new.post_id;
    return new;
  end if;
  update public.community_posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
  return old;
end;
$$;

drop trigger if exists community_comments_count on public.community_comments;
create trigger community_comments_count after insert or delete on public.community_comments
for each row execute function public.community_sync_comment_count();

alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
revoke all on public.community_posts from anon, authenticated;
revoke all on public.community_comments from anon, authenticated;
grant all on public.community_posts to service_role;
grant all on public.community_comments to service_role;

