-- Fix psychologists table RLS policies to allow trigger inserts
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Psychologists can insert their own data" ON public.psychologists;

-- Create new policy that allows inserts during signup
CREATE POLICY "Allow psychologist registration"
ON public.psychologists
FOR INSERT
WITH CHECK (true);

-- Keep update policy for psychologists to manage their own data
CREATE POLICY "Psychologists can update own data"
ON public.psychologists
FOR UPDATE
USING (auth.uid() = user_id);

-- Ensure psychologists table has proper structure
ALTER TABLE public.psychologists 
  ALTER COLUMN verificado SET DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_psychologists_user_id ON public.psychologists(user_id);
CREATE INDEX IF NOT EXISTS idx_psychologists_verificado ON public.psychologists(verificado);