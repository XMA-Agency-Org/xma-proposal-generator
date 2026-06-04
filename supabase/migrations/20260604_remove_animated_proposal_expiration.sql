-- Finish removing the proposal expiration system for animated proposals.
--
-- The expiration/countdown removal in 6fbdac9 only touched the classic proposal
-- frontend; the animated public-view RPC still gated on expires_at, so animated
-- proposals silently 404'd once their (legacy) expires_at passed. This drops the
-- expiry clause from the RPC and nulls out every lingering expires_at so no
-- animated proposal can expire out of view again.

create or replace function public.get_animated_by_token(p_token text)
returns setof public.animated_proposals
language sql security definer stable as $$
  select * from public.animated_proposals
  where token = p_token
    and status in ('approved','sent','client_signed','counter_signed','paid','archived');
$$;

update public.animated_proposals
set expires_at = null
where expires_at is not null;
