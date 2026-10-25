create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists state text;
alter table public.profiles add column if not exists postal_code text;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  price numeric(12,2) not null check (price >= 0),
  category_id uuid references public.categories(id) on delete set null,
  category text,
  images text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  sku text unique,
  material text,
  dimensions text,
  weight numeric(10,2) check (weight is null or weight >= 0),
  care_instructions text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.products add column if not exists sku text;
alter table public.products add column if not exists material text;
alter table public.products add column if not exists dimensions text;
alter table public.products add column if not exists weight numeric(10,2);
alter table public.products add column if not exists care_instructions text;
alter table public.products add column if not exists is_featured boolean not null default false;
create unique index if not exists products_sku_unique on public.products (sku) where sku is not null;

create table if not exists public.carts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer jsonb not null,
  items jsonb not null,
  total_amount numeric(12,2) not null check (total_amount >= 0),
  payment_gateway text not null default 'Cashfree',
  payment_status text not null default 'Pending' check (payment_status in ('Pending','Paid','Failed')),
  shipment_id text,
  tracking_number text,
  courier_name text,
  fulfillment_status text not null default 'Order Placed' check (fulfillment_status in ('Order Placed','Packed','Shipped','Out for Delivery','Delivered')),
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage','flat')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.orders enable row level security;
alter table public.coupons enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Published products are public" on public.products;
drop policy if exists "Categories are public" on public.categories;
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Users create own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Users manage own cart" on public.carts;
drop policy if exists "Users read own orders" on public.orders;
create policy "Published products are public" on public.products for select using (is_published = true);
create policy "Categories are public" on public.categories for select using (true);
create policy "Published reviews are public" on public.reviews for select using (is_published = true);
create policy "Guests can submit reviews" on public.reviews for insert with check (char_length(name) between 1 and 80 and char_length(body) between 10 and 2000);
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users create own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users manage own cart" on public.carts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read own orders" on public.orders for select using (auth.uid() = user_id);

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

drop policy if exists "Admins manage products" on public.products;
drop policy if exists "Admins manage categories" on public.categories;
drop policy if exists "Admins manage orders" on public.orders;
drop policy if exists "Admins manage customers" on public.profiles;
create policy "Admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage customers" on public.profiles for select using (auth.uid() = id or public.is_admin());

drop policy if exists "Authenticated users upload media" on storage.objects;
drop policy if exists "Authenticated users read media" on storage.objects;
drop policy if exists "Authenticated users delete own media" on storage.objects;
create policy "Authenticated users upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "Authenticated users read media" on storage.objects for select to authenticated using (bucket_id = 'media');
create policy "Authenticated users delete own media" on storage.objects for delete to authenticated using (bucket_id = 'media' and owner_id = auth.uid()::text);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do update set name = excluded.name;
  return new;
end; $$;

grant usage on schema public to supabase_auth_admin;
grant insert, select, update on public.profiles to supabase_auth_admin;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Run manually after reviewing the account:
-- update public.profiles set role = 'admin' where id = 'AUTH_USER_UUID';
