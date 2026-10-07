-- ========================================================
-- AGGIORNAMENTO SICUREZZA RLS PER SUPERADMIN
-- Esegui questo script nel "SQL Editor" di Supabase
-- ========================================================

-- Permetti al SuperAdmin di visualizzare tutte le sottoscrizioni degli Host
drop policy if exists "SuperAdmin gestione totale sottoscrizioni" on public.host_subscriptions;
create policy "SuperAdmin gestione totale sottoscrizioni" on public.host_subscriptions
  for all using (
    auth.jwt() ->> 'email' = 'silveriopintus@gmail.com'
    or exists (
      select 1 from public.host_subscriptions
      where user_id = auth.uid() and role = 'superadmin'
    )
  );

-- Permetti al SuperAdmin di visualizzare tutte le proprietà se necessario
drop policy if exists "SuperAdmin visualizza tutte le proprietà" on public.properties;
create policy "SuperAdmin visualizza tutte le proprietà" on public.properties
  for select using (
    auth.jwt() ->> 'email' = 'silveriopintus@gmail.com'
  );
