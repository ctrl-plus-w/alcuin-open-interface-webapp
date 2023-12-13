# Next.js Project Template

This repository is a Next.js project template using TailwindCSS, ESLint & Prettier.

## Installation

1. Change the project name in the `package.json`.

2. Run `npm install`

## Important

If you run this project on Vercel, you might need to set up the `NEXT_PUBLIC_RSA_PUBLIC_KEY` in the environnement variables. Please wrap the key inside quotes (") to avoid errors. (The error encountered might be : `length octect is too long at: (shallow)`)

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

You then need to create the triggers to run the functions. The condition table is the `auth users` table, you need to match the event with the function selected, set the trigger to run **after the event** and run it **one time per row**.

## Get unique professors function

```pgsql
CREATE OR REPLACE FUNCTION get_professors()
RETURNS SETOF text AS $$
DECLARE
    value text;
BEGIN
    -- Use UNNEST and DISTINCT to get distinct unnested values from the array column
    FOR value IN SELECT DISTINCT unnest(professors) FROM courses
    LOOP
        -- Return each distinct unnested value
        RETURN NEXT value;
    END LOOP;

    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Call the function
SELECT * FROM get_professors();
```
