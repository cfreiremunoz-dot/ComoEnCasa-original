import { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { categories, zones } from '@/data/content';
import { recommendationSchema, uploadPhoto, type Recommendation, type RecommendationInput } from '@/lib/recommendations';

const field = 'w-full rounded-xl border border-crema-300 bg-white px-4 py-2.5 text-sm text-tinta-800 outline-none focus:border-terracota-400';
const label = 'mb-1.5 block text-sm font-medium text-tinta-700';

interface Props {
  initial?: Partial<Recommendation>;
  submitLabel: string;
  onSubmit: (values: RecommendationInput & { image_url: string | null }) => Promise<void>;
}

export function RecommendationForm({ initial, submitLabel, onSubmit }: Props) {
  const [v, setV] = useState({
    name: initial?.name ?? '',
    category: initial?.category ?? 'gastronomia',
    zone: initial?.zone ?? 'centro',
    description: initial?.description ?? '',
    address: initial?.address ?? '',
    phone: initial?.phone ?? '',
    website: initial?.website ?? '',
    instagram: initial?.instagram ?? '',
    rating: initial?.rating ?? 5,
    author_name: initial?.author_name ?? '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setV({ ...v, [k]: e.target.value });

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    const parsed = recommendationSchema.safeParse(v);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Revisa los datos');
      return;
    }
    setBusy(true);
    try {
      const image_url = file ? await uploadPhoto(file) : initial?.image_url ?? null;
      await onSubmit({ ...parsed.data, image_url });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo guardar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handle} className="grid gap-5">
      <div>
        <label className={label}>Nombre del lugar *</label>
        <input className={field} value={v.name} onChange={set('name')} maxLength={120} required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Tipo de lugar</label>
          <select className={field} value={v.category} onChange={set('category')}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Zona</label>
          <select className={field} value={v.zone} onChange={set('zone')}>
            {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={label}>¿Por qué lo recomiendas? *</label>
        <textarea className={`${field} min-h-28`} value={v.description} onChange={set('description')} maxLength={2000} required />
      </div>
      <div>
        <span className={label}>Calificación</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} aria-label={`${n} estrellas`} onClick={() => setV({ ...v, rating: n })}>
              <Star className={`h-7 w-7 ${n <= v.rating ? 'fill-terracota-400 text-terracota-400' : 'text-crema-300'}`} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={label}>Foto</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
        {initial?.photo && !file && <img src={initial.photo} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
      </div>
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold text-tinta-800">Contacto del sitio (opcional)</legend>
        <div><label className={label}>Dirección</label><input className={field} value={v.address} onChange={set('address')} maxLength={200} /></div>
        <div><label className={label}>Teléfono</label><input className={field} value={v.phone} onChange={set('phone')} maxLength={40} /></div>
        <div><label className={label}>Web</label><input className={field} value={v.website} onChange={set('website')} maxLength={300} /></div>
        <div><label className={label}>Instagram</label><input className={field} value={v.instagram} onChange={set('instagram')} maxLength={100} /></div>
      </fieldset>
      <div>
        <label className={label}>Tu nombre (opcional)</label>
        <input className={field} value={v.author_name} onChange={set('author_name')} maxLength={80} />
      </div>
      <button disabled={busy} className="justify-self-start rounded-full bg-terracota-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-terracota-600 disabled:opacity-60">
        {busy ? 'Guardando…' : submitLabel}
      </button>
    </form>
  );
}
