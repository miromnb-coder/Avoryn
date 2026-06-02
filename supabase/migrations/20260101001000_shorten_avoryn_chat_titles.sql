with normalized_titles as (
  select
    id,
    trim(
      regexp_replace(
        regexp_replace(coalesce(title, 'New chat'), '[\r\n]+', ' ', 'g'),
        '\s+',
        ' ',
        'g'
      )
    ) as clean_title
  from public.avoryn_conversations
), word_titles as (
  select
    id,
    clean_title,
    array_to_string((regexp_split_to_array(clean_title, '\s+'))[1:5], ' ') as word_title
  from normalized_titles
), shortened_titles as (
  select
    id,
    case
      when clean_title = '' then 'New chat'
      when length(word_title) > 28 then trim(substring(word_title from 1 for 27)) || '…'
      when length(clean_title) > length(word_title) then word_title || '…'
      else word_title
    end as next_title
  from word_titles
)
update public.avoryn_conversations conversation
   set title = shortened_titles.next_title
  from shortened_titles
 where conversation.id = shortened_titles.id
   and conversation.title is distinct from shortened_titles.next_title;
