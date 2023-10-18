# NextJS Project Template

This repository is a NextJS project template using TailwindCSS, ESLint & Prettier.

## Installation

1. Change the project name in the `package.json`.

2. Run `npm install`

## Snippets

You have access to 4 default snippets in the `.vscode/snippets.code-snippets` file.

## Documentation

### Supabase

#### Profiles table
```pgsql
create table public.profiles (
  id uuid not null,
  email text not null,
  created_at timestamp with time zone null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade
) tablespace pg_default;
 ```

#### User handling functions
When creating the functions, you need to set the type of security to **SECURITY DEFINER** and set the return type to **TRIGGER**.
```pgsql
-- When creating a user
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$function$
```

```pgsql
-- When updating a user
CREATE OR REPLACE FUNCTION public.handle_udpate_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  update public.profiles set email=new.email where id=new.id;
  return new;
end;
$function$
```

```pgsql
-- When deleting a user
CREATE OR REPLACE FUNCTION public.handle_old_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  delete from public.profiles where id=old.id;
  return old;
end;
$function$
```
You then need to create the triggers to run the functions. The condition table is the `auth users` table, you need to match the event with the function selected, set the trigger to run __after the event__ and run it __one time per row__.