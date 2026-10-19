-- Additive migration. Does not alter, update, delete or recreate workouts.
begin;
create table public.journal_entries (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 date date not null,
 data jsonb not null,
 revision integer not null default 1 check(revision>0),
 updated_at timestamptz not null default now(),
 constraint journal_document check(
 jsonb_typeof(data)='object' and octet_length(data::text)<=200000
 and data ?& array['id','date','area','topic','title','minutes','notes','practice','next','review','archived','outcome','goals']
 and data->>'id'=id::text and data->>'date'=date::text
 and data->>'area' in ('career','english','daily')
 and length(data->>'title') between 1 and 160
 and length(data->>'topic') between 1 and 100
 and jsonb_typeof(data->'minutes')='number'
 and (data->>'minutes')::numeric between 0 and 1440
 and jsonb_typeof(data->'review')='boolean'
 and jsonb_typeof(data->'archived')='boolean'
 and data->>'outcome' in ('practice','independent','completed')
 and jsonb_typeof(data->'goals')='array' and jsonb_array_length(data->'goals')<=3
 )
);
create index journal_user_date on public.journal_entries(user_id,date desc,id);
alter table public.journal_entries enable row level security;
alter table public.journal_entries force row level security;
revoke all on public.journal_entries from anon;
revoke all on public.journal_entries from authenticated;
grant select,insert,update on public.journal_entries to authenticated;
create policy "Read own journal" on public.journal_entries for select to authenticated using ((select auth.uid())=user_id);
create policy "Insert own journal" on public.journal_entries for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Update own journal" on public.journal_entries for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create function public.journal_revision_guard() returns trigger language plpgsql set search_path='' as $$
begin
 if TG_OP='UPDATE' then
  if new.id<>old.id or new.user_id<>old.user_id then raise exception 'Owner and id are immutable'; end if;
  if new.revision<>old.revision+1 then raise exception 'Revision must increment by one'; end if;
 elsif new.revision<>1 then raise exception 'Revision must start at one';
 end if;
 new.updated_at=now(); return new;
end; $$;
create trigger journal_revision before insert or update on public.journal_entries for each row execute function public.journal_revision_guard();
commit;
