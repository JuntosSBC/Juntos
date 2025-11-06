-- Add max_membros column to grupo table
ALTER TABLE public.grupo 
ADD COLUMN max_membros integer DEFAULT 50 NOT NULL;

-- Update the RLS policy for creating groups to allow only admins and psychologists
DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.grupo;

CREATE POLICY "Only admins and psychologists can create groups"
ON public.grupo
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'psychologist'::app_role)
  )
);