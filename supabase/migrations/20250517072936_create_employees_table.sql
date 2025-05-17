-- Create enum type for employment_type
create type employment_type as enum ('fullTime', 'partTime');

-- Create employees table
create table employees (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  middle_name text,
  last_name text not null,
  display_name text,
  email text not null unique,
  position_id uuid references positions(id),
  address text not null,
  site_id uuid references sites(id),
  manager_id uuid references employees(id),
  employment_type employment_type not null,
  start_date date not null,
  end_date date,
  department_id uuid references departments(id),
  picture_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint valid_end_date check (end_date is null or end_date >= start_date)
);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_employees_updated_at
  before update on employees
  for each row
  execute function update_updated_at_column();
