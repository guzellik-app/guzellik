-- 0. Clean up existing tables and triggers to ensure a fresh start
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop table if exists public.services cascade;
drop table if exists public.clinic_settings cascade;
drop table if exists public.profiles cascade;

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text not null default 'patient' check (role in ('patient', 'clinic', 'admin')),
  full_name text,
  email text,
  is_verified boolean not null default false,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update using ( auth.uid() = id );

create policy "Admins can update and manage all profiles."
  on public.profiles for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 2. Bulletproof Trigger for automatic profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_role text;
begin
  -- Extract role from meta data, default to 'patient'
  v_role := coalesce(new.raw_user_meta_data->>'role', 'patient');
  
  -- Ensure role is valid, otherwise fallback to 'patient'
  if v_role not in ('patient', 'clinic', 'admin') then
    v_role := 'patient';
  end if;

  -- Insert the profile, ignoring if it already exists
  insert into public.profiles (id, role, email)
  values (new.id, v_role, new.email)
  on conflict (id) do nothing;
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Clinic Settings Table
create table public.clinic_settings (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  clinic_name text,
  description text,
  address text,
  city text,
  phone text,
  website text,
  profile_picture text,
  cover_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.clinic_settings enable row level security;

create policy "Clinic settings are viewable by everyone."
  on public.clinic_settings for select using ( true );

create policy "Clinics can insert their own settings."
  on public.clinic_settings for insert with check ( auth.uid() = id );

create policy "Clinics can update own settings."
  on public.clinic_settings for update using ( auth.uid() = id );

create policy "Admins can manage all clinic settings."
  on public.clinic_settings for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert clinic settings."
  on public.clinic_settings for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 4. Services Table
create table public.services (
  id uuid default gen_random_uuid() primary key,
  clinic_id uuid references auth.users on delete cascade not null,
  name text not null,
  category text,
  price text,
  status text default 'Active',
  features text,
  image text,
  images text[],
  description text,
  country_city text,
  duration text,
  included jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;

create policy "Services are viewable by everyone."
  on public.services for select using ( true );

create policy "Clinics can insert their own services."
  on public.services for insert with check ( auth.uid() = clinic_id );

create policy "Clinics can update their own services."
  on public.services for update using ( auth.uid() = clinic_id );

create policy "Clinics can delete their own services."
  on public.services for delete using ( auth.uid() = clinic_id );

-- 5. Requests Table
create table public.requests (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references auth.users on delete cascade not null,
  clinic_id uuid,
  service_id text,
  service_name text,
  service_link text,
  full_name text,
  phone text,
  message text,
  status text default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.requests enable row level security;

create policy "Patients can view their own requests."
  on public.requests for select using ( auth.uid() = patient_id );

create policy "Clinics can view requests sent to them."
  on public.requests for select using ( auth.uid() = clinic_id );

create policy "Admins can view all requests."
  on public.requests for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Patients can insert requests."
  on public.requests for insert with check ( auth.uid() = patient_id );

-- 6. Request Messages Table
create table public.request_messages (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references public.requests on delete cascade not null,
  sender_id uuid references auth.users on delete cascade not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.request_messages enable row level security;

create policy "Users can view messages for their requests."
  on public.request_messages for select using (
    exists (
      select 1 from public.requests r
      where r.id = request_messages.request_id
      and (r.patient_id = auth.uid() or r.clinic_id = auth.uid())
    )
  );

create policy "Admins can view all request messages."
  on public.request_messages for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can insert messages for their requests."
  on public.request_messages for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.requests r
      where r.id = request_messages.request_id
      and (r.patient_id = auth.uid() or r.clinic_id = auth.uid())
    )
  );

-- 7. Storage Buckets
insert into storage.buckets (id, name, public) values ('service-images', 'service-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('clinic-images', 'clinic-images', true) on conflict (id) do nothing;

create policy "Service images are publicly accessible."
  on storage.objects for select using ( bucket_id = 'service-images' );

create policy "Clinics can upload service images."
  on storage.objects for insert with check ( bucket_id = 'service-images' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Clinics can update their own service images."
  on storage.objects for update using ( bucket_id = 'service-images' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Clinics can delete their own service images."
  on storage.objects for delete using ( bucket_id = 'service-images' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Clinic images are publicly accessible."
  on storage.objects for select using ( bucket_id = 'clinic-images' );

create policy "Clinics can upload clinic images."
  on storage.objects for insert with check ( bucket_id = 'clinic-images' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Clinics can update their own clinic images."
  on storage.objects for update using ( bucket_id = 'clinic-images' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Clinics can delete their own clinic images."
  on storage.objects for delete using ( bucket_id = 'clinic-images' and auth.uid()::text = (storage.foldername(name))[1] );
