-- Enable realtime for grupo table
ALTER TABLE public.grupo REPLICA IDENTITY FULL;

-- The table should already be in the publication, but we ensure it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'grupo'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.grupo;
  END IF;
END $$;