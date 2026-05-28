create or replace function public.get_animated_by_token(p_token text)
returns setof public.animated_proposals
language sql security definer stable as $$
  select * from public.animated_proposals
  where token = p_token
    and status in ('approved','sent','client_signed','counter_signed','paid','archived')
    and (expires_at is null or expires_at > now() or status = 'archived');
$$;
