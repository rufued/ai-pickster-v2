grant select on table public.parlays, public.parlay_legs to anon, authenticated;
grant all privileges on table public.parlays, public.parlay_legs to service_role;
grant usage, select on sequence public.parlay_legs_id_seq to service_role;
