-- Update existing tables to use UUID user references instead of integer
-- First, let's add new UUID columns
ALTER TABLE public.grupo ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.grupo_membro ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.mensagem_grupo ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Drop old RLS policies
DROP POLICY IF EXISTS "Public read access" ON public.grupo;
DROP POLICY IF EXISTS "Public read access" ON public.grupo_membro;
DROP POLICY IF EXISTS "Public read access" ON public.mensagem_grupo;

-- Create proper RLS policies for groups
CREATE POLICY "Users can view all groups" ON public.grupo FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create groups" ON public.grupo FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Group creators can update their groups" ON public.grupo FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for group members
CREATE POLICY "Users can view group members" ON public.grupo_membro FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join groups" ON public.grupo_membro FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups they joined" ON public.grupo_membro FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for group messages
CREATE POLICY "Group members can view messages" ON public.mensagem_grupo FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.grupo_membro 
    WHERE grupo_membro.id_grupo = mensagem_grupo.id_grupo 
    AND grupo_membro.user_id = auth.uid()
  )
);
CREATE POLICY "Group members can send messages" ON public.mensagem_grupo FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.grupo_membro 
    WHERE grupo_membro.id_grupo = mensagem_grupo.id_grupo 
    AND grupo_membro.user_id = auth.uid()
  )
);

-- Enable realtime for messages
ALTER TABLE public.mensagem_grupo REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.mensagem_grupo;