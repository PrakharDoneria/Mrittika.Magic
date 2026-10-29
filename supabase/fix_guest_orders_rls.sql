-- =========================================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO PERMIT GUEST (UNAUTHENTICATED) ORDERS
-- =========================================================================

-- Enable RLS on orders (if not already enabled)
alter table public.orders enable row level security;

-- Drop existing order insert/select policies
drop policy if exists "Anyone can insert orders" on public.orders;
drop policy if exists "Users read own orders" on public.orders;

-- 1. Allow unauthenticated visitors / guests to insert new orders
create policy "Anyone can insert orders" 
on public.orders 
for insert 
with check (true);

-- 2. Allow authenticated users to view their own orders, or guests if user_id is null, and admins
create policy "Users read own orders" 
on public.orders 
for select 
using (
  user_id is null 
  or auth.uid() = user_id 
  or public.is_admin()
);

-- 3. Allow Cashfree webhook and checkout verification to update payment status
drop policy if exists "Anyone can update payment status" on public.orders;
create policy "Anyone can update payment status"
on public.orders
for update
using (true)
with check (true);

