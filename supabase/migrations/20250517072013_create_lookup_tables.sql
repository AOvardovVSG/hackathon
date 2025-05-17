-- positions table
create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

-- departments table
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

-- sites table
create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  city text not null
);
