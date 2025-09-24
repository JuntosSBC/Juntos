-- Create profiles table that properly references auth.users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('comum', 'psychologist')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Update psychologist table to reference profiles instead of usuario
ALTER TABLE public.psicologo 
DROP COLUMN IF EXISTS id_usuario;

ALTER TABLE public.psicologo 
ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Enable RLS on psicologo table
ALTER TABLE public.psicologo ENABLE ROW LEVEL SECURITY;

-- Create policies for psychologist table
CREATE POLICY "Psychologists can view their own data" 
ON public.psicologo 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Psychologists can update their own data" 
ON public.psicologo 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Psychologists can insert their own data" 
ON public.psicologo 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, tipo_usuario)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'nome',
    new.raw_user_meta_data ->> 'tipo_usuario'
  );
  
  -- If it's a psychologist, create psychologist record
  IF new.raw_user_meta_data ->> 'tipo_usuario' = 'psychologist' THEN
    INSERT INTO public.psicologo (user_id, crp, especialidade, bio)
    VALUES (
      new.id,
      new.raw_user_meta_data ->> 'crp',
      new.raw_user_meta_data ->> 'especialidade',
      new.raw_user_meta_data ->> 'bio'
    );
  END IF;
  
  RETURN new;
END;
$$;

-- Create trigger to automatically handle new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();