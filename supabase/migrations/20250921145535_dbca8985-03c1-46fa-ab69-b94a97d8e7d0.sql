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

-- Since we're using the new profiles system, make old tables admin-only
CREATE POLICY "Admin only access" ON public.usuario FOR ALL USING (false);
CREATE POLICY "Admin only access" ON public.adm FOR ALL USING (false);

-- Set up basic policies for other tables
CREATE POLICY "Public read access" ON public.artigo FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.projeto FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.grupo FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.grupo_membro FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.mensagem_grupo FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.evento_grupo FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.comentario_artigo FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.comentario_projeto FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.foto_projeto FOR SELECT USING (true);