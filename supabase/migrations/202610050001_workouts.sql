-- Run once in your own Supabase project's SQL Editor.
-- No secret key is needed by the browser. All access is checked by RLS.
begin;
create table public.workouts (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  data jsonb not null,
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  constraint workout_document check (
    jsonb_typeof(data) = 'object' and octet_length(data::text) <= 200000
    and data ?& array['id','date','split','notes','sleep','energy','exercises']
    and data->>'id' = id::text and data->>'date' = date::text
    and jsonb_typeof(data->'exercises') = 'array'
    and jsonb_array_length(data->'exercises') <= 60
    and length(data->>'split') between 1 and 50
  )
);
create index workouts_user_date on public.workouts(user_id,date desc,id);
alter table public.workouts enable row level security;
alter table public.workouts force row level security;
revoke all on public.workouts from anon;
grant select,insert,update,delete on public.workouts to authenticated;
create policy "Read own workouts" on public.workouts for select to authenticated using ((select auth.uid())=user_id);
create policy "Insert own workouts" on public.workouts for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Update own workouts" on public.workouts for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Delete own workouts" on public.workouts for delete to authenticated using ((select auth.uid())=user_id);
create function public.workout_revision_guard() returns trigger language plpgsql set search_path = '' as $$
begin
  if TG_OP='UPDATE' then
    if new.id <> old.id or new.user_id <> old.user_id then raise exception 'Owner and id are immutable'; end if;
    if new.revision <> old.revision+1 then raise exception 'Revision must increment by one'; end if;
  elsif new.revision <> 1 then raise exception 'New workout must start at revision one';
  end if;
  new.updated_at = now(); return new;
end; $$;
create trigger workout_revision before insert or update on public.workouts for each row execute function public.workout_revision_guard();
commit;
