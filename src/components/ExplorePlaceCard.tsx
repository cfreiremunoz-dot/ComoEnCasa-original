import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import type { Place } from '@/data/types';
import { getCategoryById } from '@/data/content';
import { CategoryIcon } from '@/components/CategoryIcon';

interface ExplorePlaceCardProps {
  place: Place;
}

export function ExplorePlaceCard({ place }: ExplorePlaceCardProps) {
  const category = getCategoryById(place.category);

  return (
    <Link
      to={`/lugar/${place.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-sm ring-1 ring-tinta-100/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-tinta-900/10"
    >
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-albero-100">
        <img
          src={place.image}
          alt={place.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta-900/45 via-transparent to-transparent" />
        {category && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-crema-100/95 px-3 py-1.5 text-[11px] font-semibold text-tinta-700 shadow-sm backdrop-blur-sm">
            <CategoryIcon name={category.icon} className="h-3.5 w-3.5 text-terracota-600" />
            {category.shortName}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-xl font-semibold leading-tight text-tinta-800 transition-colors group-hover:text-terracota-600">
          {place.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tinta-500">
          {place.excerpt}
        </p>
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-xs font-semibold text-terracota-600">
          Descubrir lugar
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
