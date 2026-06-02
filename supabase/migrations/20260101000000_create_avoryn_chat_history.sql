create table if not exists public.avoryn_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table if not exists public.avoryn_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.avoryn_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'avoryn')),
  content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists avoryn_conversations_user_last_message_idx
  on public.avoryn_conversations(user_id, last_message_at desc);

create index if not exists avoryn_messages_conversation_created_idx
  on public.avoryn_messages(conversation_id, created_at asc);

create index if not exists avoryn_messages_user_created_idx
  on public.avoryn_messages(user_id, created_at desc);

create or replace function public.avoryn_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.avoryn_touch_conversation_from_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.avoryn_conversations
     set last_message_at = new.created_at,
         updated_at = now()
   where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists avoryn_conversations_set_updated_at on public.avoryn_conversations;
create trigger avoryn_conversations_set_updated_at
  before update on public.avoryn_conversations
  for each row execute function public.avoryn_set_updated_at();

drop trigger if exists avoryn_messages_touch_conversation on public.avoryn_messages;
create trigger avoryn_messages_touch_conversation
  after insert on public.avoryn_messages
  for each row execute function public.avoryn_touch_conversation_from_message();

alter table public.avoryn_conversations enable row level security;
alter table public.avoryn_messages enable row level security;

drop policy if exists "Users can view their own Avoryn conversations" on public.avoryn_conversations;
create policy "Users can view their own Avoryn conversations"
  on public.avoryn_conversations
  for select
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own Avoryn conversations" on public.avoryn_conversations;
create policy "Users can create their own Avoryn conversations"
  on public.avoryn_conversations
  for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own Avoryn conversations" on public.avoryn_conversations;
create policy "Users can update their own Avoryn conversations"
  on public.avoryn_conversations
  for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own Avoryn conversations" on public.avoryn_conversations;
create policy "Users can delete their own Avoryn conversations"
  on public.avoryn_conversations
  for delete
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can view messages in their Avoryn conversations" on public.avoryn_messages;
create policy "Users can view messages in their Avoryn conversations"
  on public.avoryn_messages
  for select
  using (
    exists (
      select 1
      from public.avoryn_conversations
      where avoryn_conversations.id = avoryn_messages.conversation_id
        and avoryn_conversations.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users can create messages in their Avoryn conversations" on public.avoryn_messages;
create policy "Users can create messages in their Avoryn conversations"
  on public.avoryn_messages
  for insert
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.avoryn_conversations
      where avoryn_conversations.id = avoryn_messages.conversation_id
        and avoryn_conversations.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users can delete messages in their Avoryn conversations" on public.avoryn_messages;
create policy "Users can delete messages in their Avoryn conversations"
  on public.avoryn_messages
  for delete
  using (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.avoryn_conversations
      where avoryn_conversations.id = avoryn_messages.conversation_id
        and avoryn_conversations.user_id = (select auth.uid())
    )
  );

revoke execute on function public.avoryn_set_updated_at() from public;
revoke execute on function public.avoryn_touch_conversation_from_message() from public;
