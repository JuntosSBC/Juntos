-- Enable RLS on all remaining tables
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artigo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentario_artigo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentario_projeto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evento_grupo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foto_projeto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupo_membro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagem_grupo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projeto ENABLE ROW LEVEL SECURITY;

-- Since we're using the new profiles system, we can set basic policies for the old usuario table
-- or make it admin-only since it's no longer the main user table
CREATE POLICY "Admin only access" ON public.usuario FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.adm FOR ALL USING (false);

-- Set up basic policies for other tables (can be refined later)
CREATE POLICY "Public read access" ON public.artigo FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.projeto FOR SELECT USING (true);

-- Group related policies - users can see groups they're members of
CREATE POLICY "Members can view groups" ON public.grupo 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.grupo_membro 
    WHERE grupo_membro.id_grupo = grupo.id_grupo 
    AND grupo_membro.id_usuario = (
      SELECT id FROM public.profiles WHERE id = auth.uid()
    )
  ) OR true -- Allow public viewing for now
);

CREATE POLICY "Users can view group memberships" ON public.grupo_membro 
FOR SELECT USING (true); -- Allow viewing memberships

-- Message policies - users can see messages in groups they're members of
CREATE POLICY "Group members can view messages" ON public.mensagem_grupo 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.grupo_membro 
    WHERE grupo_membro.id_grupo = mensagem_grupo.id_grupo 
    AND grupo_membro.id_usuario = (
      SELECT id FROM public.profiles WHERE id = auth.uid()
    )
  )
);

-- Event policies
CREATE POLICY "Group members can view events" ON public.evento_grupo 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.grupo_membro 
    WHERE grupo_membro.id_grupo = evento_grupo.id_grupo 
    AND grupo_membro.id_usuario = (
      SELECT id FROM public.profiles WHERE id = auth.uid()
    )
  )
);

-- Comment policies
CREATE POLICY "Public can view article comments" ON public.comentario_artigo FOR SELECT USING (true);
CREATE POLICY "Public can view project comments" ON public.comentario_projeto FOR SELECT USING (true);

-- Photo policies
CREATE POLICY "Public can view project photos" ON public.foto_projeto FOR SELECT USING (true);