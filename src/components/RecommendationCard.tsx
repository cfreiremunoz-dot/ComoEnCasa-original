import { Globe, Instagram, MapPin, Phone, Star } from 'lucide-react';
import { getCategoryById, getZoneById } from '@/data/content';
import type { Recommendation } from '@/lib/recommendations';

export function RecommendationCard({ r, children }: { r: Recommendation; children?: React.ReactNode }) {
  const site = r.website && (r.website.startsWith('http') ? r.website : `https://${r.website}`);
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-crema-300">
      {r.photo && <img src={r.photo} alt={r.name} className="h-48 w-full object-cover" loading="lazy" />}
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-terracota-500">
          {getCategoryById(r.category)?.shortName ?? r.category} · {getZoneById(r.zone)?.name ?? r.zone}
        </p>
        <h3 className="mt-1 font-serif text-xl font-semibold text-tinta-800">{r.name}</h3>
        <div className="mt-1 flex" aria-label={`${r.rating} de 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className={`h-4 w-4 ${n <= r.rating ? 'fill-terracota-400 text-terracota-400' : 'text-crema-300'}`} />
          ))}
        </div>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-tinta-600">{r.description}</p>
        <ul className="mt-4 space-y-1 text-sm text-tinta-600">
          {r.address && <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" />{r.address}</li>}
          {r.phone && <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0" /><a href={`tel:${r.phone}`}>{r.phone}</a></li>}
          {site && <li className="flex gap-2"><Globe className="h-4 w-4 shrink-0" /><a href={site} target="_blank" rel="noopener noreferrer" className="underline">{r.website}</a></li>}
          {r.instagram && <li className="flex gap-2"><Instagram className="h-4 w-4 shrink-0" />{r.instagram}</li>}
        </ul>
        {r.author_name && <p className="mt-4 text-xs text-tinta-400">Recomendado por {r.author_name}</p>}
        {children}
      </div>
    </article>
  );
}
