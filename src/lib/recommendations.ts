import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type Recommendation = Database['public']['Tables']['recommendations']['Row'] & { photo?: string };

export const BUCKET = 'recommendation-photos';

export const recommendationSchema = z.object({
  name: z.string().trim().min(2, 'Escribe el nombre del lugar').max(120),
  category: z.string().min(1),
  zone: z.string().min(1),
  description: z.string().trim().min(10, 'Cuéntanos un poco más (mínimo 10 letras)').max(2000),
  address: z.string().trim().max(200).optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  website: z.string().trim().max(300).optional().or(z.literal('')),
  instagram: z.string().trim().max(100).optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5),
  author_name: z.string().trim().max(80).optional().or(z.literal('')),
});
export type RecommendationInput = z.infer<typeof recommendationSchema>;

async function withPhotos(rows: Database['public']['Tables']['recommendations']['Row'][]): Promise<Recommendation[]> {
  const paths = rows.map((r) => r.image_url).filter((p): p is string => !!p);
  if (!paths.length) return rows;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 24);
  const map = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return rows.map((r) => ({ ...r, photo: r.image_url ? map.get(r.image_url) ?? undefined : undefined }));
}

export function useRecommendations(scope: 'approved' | 'all') {
  return useQuery({
    queryKey: ['recommendations', scope],
    queryFn: async () => {
      let q = supabase.from('recommendations').select('*').order('created_at', { ascending: false });
      if (scope === 'approved') q = q.eq('status', 'approved');
      const { data, error } = await q;
      if (error) throw error;
      return withPhotos(data ?? []);
    },
  });
}

export async function uploadPhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen');
  if (file.size > 5 * 1024 * 1024) throw new Error('La foto no puede pasar de 5 MB');
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

export const SITE_TEXT_DEFAULTS = {
  hero_title_1: 'Sevilla no solo se visita.',
  hero_title_2: 'Se vive.',
  hero_subtitle: 'Descubre la ciudad desde dentro, con mirada local.',
} as const;
export type SiteTextKey = keyof typeof SITE_TEXT_DEFAULTS;

export function useSiteTexts() {
  const q = useQuery({
    queryKey: ['site_texts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_texts').select('key, value');
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) as Partial<Record<SiteTextKey, string>>;
    },
  });
  return { ...SITE_TEXT_DEFAULTS, ...(q.data ?? {}) };
}

export function useIsAdmin() {
  return useQuery({
    queryKey: ['is_admin'],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data } = await supabase.rpc('has_role', { _user_id: u.user.id, _role: 'admin' });
      return !!data;
    },
  });
}
