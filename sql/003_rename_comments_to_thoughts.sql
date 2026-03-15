-- Rename existing comments table to thoughts and add created_at column if missing.

DO $$
BEGIN
  IF to_regclass('public.comments') IS NOT NULL
     AND to_regclass('public.thoughts') IS NULL THEN
    ALTER TABLE public.comments RENAME TO thoughts;
  END IF;
END $$;

ALTER TABLE IF EXISTS public.thoughts
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

