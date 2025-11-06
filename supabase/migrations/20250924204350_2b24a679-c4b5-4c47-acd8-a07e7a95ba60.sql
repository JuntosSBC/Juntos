-- Add missing columns to profiles table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_id') THEN
        ALTER TABLE public.profiles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
END $$;

-- Update RLS policies for profiles to allow public read access for names (needed for chat)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Create psychologists table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.psychologists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  crp TEXT,
  especialidade TEXT,
  bio TEXT,
  verificado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE public.psychologists ENABLE ROW LEVEL SECURITY;

-- Create policies for psychologists
DROP POLICY IF EXISTS "Psychologists can view their own data" ON public.psychologists;
CREATE POLICY "Anyone can view psychologists" 
ON public.psychologists 
FOR SELECT 
USING (true);

CREATE POLICY "Psychologists can update their own data" 
ON public.psychologists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Psychologists can insert their own data" 
ON public.psychologists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update the handle_new_user function to use correct column names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, user_id, nome, tipo_usuario, email)
  VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'tipo_usuario', 'comum'),
    NEW.email
  );

  -- If user is a psychologist, also insert into psychologists table
  IF NEW.raw_user_meta_data ->> 'tipo_usuario' = 'psychologist' THEN
    INSERT INTO public.psychologists (user_id, crp, especialidade, bio)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'crp',
      NEW.raw_user_meta_data ->> 'especialidade',
      NEW.raw_user_meta_data ->> 'bio'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();