create table if not exists public.daily_horoscopes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  horoscope text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date)
);

-- Enable RLS
alter table public.daily_horoscopes enable row level security;

-- Users can read their own daily horoscopes
create policy "Users can read their own daily horoscopes"
  on public.daily_horoscopes for select
  using ( auth.uid() = user_id );

-- Service role bypasses RLS naturally, but we can explicitly add an admin policy if needed, 
-- though service_role has bypassrls by default anyway.
