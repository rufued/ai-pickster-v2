-- Caches on-demand translations of Korean-authored content (AI locker room chat
-- messages and pick/parlay analysis text) so each content+locale pair is only
-- translated once via an external API and served from cache afterward.

create table if not exists public.content_translations (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('chat_message', 'pick_analysis')),
  content_id text not null,
  locale text not null,
  translated_text text not null,
  created_at timestamptz not null default now(),
  unique (content_type, content_id, locale)
);

create index if not exists content_translations_lookup_idx
  on public.content_translations (content_type, content_id, locale);

alter table public.content_translations enable row level security;
revoke all on public.content_translations from anon, authenticated;
grant all on public.content_translations to service_role;

comment on table public.content_translations is 'Translation cache: original Korean text stays in chat_messages/picks; translated copies are cached here per content_type+content_id+locale.';
