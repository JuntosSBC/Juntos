-- Enable realtime for mensagem_grupo table
ALTER TABLE public.mensagem_grupo REPLICA IDENTITY FULL;

-- Add mensagem_grupo to realtime publication if not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'mensagem_grupo'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mensagem_grupo;
  END IF;
END $$;