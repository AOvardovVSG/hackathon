-- positions table
create table if not exists positions (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

-- departments table
create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

-- sites table
create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  city text not null
);