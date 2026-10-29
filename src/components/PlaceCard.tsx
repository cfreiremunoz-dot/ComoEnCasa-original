import { Link } from '@/lib/router-compat';
import { ArrowUpRight } from 'lucide-react';
import type { Place } from '@/data/types';
import { getCategoryById, getZoneById, budgetLabels } from '@/data/content';
import { CategoryIcon } from './CategoryIcon';
import { DemoBadge } from './DemoBadge';

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const category = getCategoryById(place.category);
  const zone = getZoneById(place.zone);

  return (
    <Link
      to={`/lugar/${place.slug}`}
      className="group card-surface overflow-hidden hover:shadow-xl hover:shadow-tinta-900/5 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={place.image}
          alt={place.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta-900/40 via-transparent to-transparent" />
        {category && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-crema-100/95 px-3 py-1.5 text-xs font-semibold text-tinta-700 backdrop-blur-sm">
            <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
            {category.shortName}
          </span>
        )}
        {place.isDemo && (
          <DemoBadge compact className="absolute top-3 right-3" />
        )}
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold leading-snug text-tinta-800 transition-colors group-hover:text-terracota-600">
          {place.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tinta-500">
          {place.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-tinta-100 pt-3">
          <div className="flex items-center gap-3 text-xs text-tinta-400">
            {zone && <span>{zone.name}</span>}
            <span className="h-1 w-1 rounded-full bg-tinta-200" />
            <span>{budgetLabels[place.budget]}</span>
          </div>
          <ArrowUpRight className="h-4 w-4 text-tinta-300 transition-all duration-300 group-hover:text-terracota-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
