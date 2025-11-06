-- Update the handle_new_user trigger to automatically assign admin role to specific email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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

  -- Auto-assign admin role to vnsxarts@gmail.com
  IF NEW.email = 'vnsxarts@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;