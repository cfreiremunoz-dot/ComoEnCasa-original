CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.first_user_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_admin AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.first_user_admin();

CREATE TABLE public.recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  category text NOT NULL DEFAULT 'rincones',
  zone text NOT NULL DEFAULT 'centro',
  description text NOT NULL CHECK (char_length(description) BETWEEN 10 AND 2000),
  address text CHECK (char_length(address) <= 200),
  phone text CHECK (char_length(phone) <= 40),
  website text CHECK (char_length(website) <= 300),
  instagram text CHECK (char_length(instagram) <= 100),
  rating int NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  image_url text CHECK (char_length(image_url) <= 500),
  author_name text CHECK (char_length(author_name) <= 80),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.recommendations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recommendations TO authenticated;
GRANT ALL ON public.recommendations TO service_role;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads approved" ON public.recommendations FOR SELECT TO anon, authenticated USING (status = 'approved' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "anyone submits pending" ON public.recommendations FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
CREATE POLICY "admin updates" ON public.recommendations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin deletes" ON public.recommendations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_texts (
  key text PRIMARY KEY,
  value text NOT NULL CHECK (char_length(value) <= 1000),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_texts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_texts TO authenticated;
GRANT ALL ON public.site_texts TO service_role;
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads texts" ON public.site_texts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin writes texts" ON public.site_texts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "anyone uploads rec photos" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'recommendation-photos');
CREATE POLICY "public reads rec photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'recommendation-photos');
CREATE POLICY "admin deletes rec photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'recommendation-photos' AND public.has_role(auth.uid(), 'admin'));