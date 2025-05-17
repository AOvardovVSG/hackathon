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

-- Insert sample data for positions
insert into public.positions (name) values
  ('Software Engineer'),
  ('Product Manager'),
  ('Data Scientist'),
  ('UX Designer'),
  ('DevOps Engineer');

-- Insert sample data for departments
insert into public.departments (name) values
  ('Engineering'),
  ('Product'),
  ('Data'),
  ('Design'),
  ('Operations');

-- Insert sample data for sites
insert into public.sites (city) values
  ('New York'),
  ('San Francisco'),
  ('London'),
  ('Berlin'),
  ('Tokyo');
