import { Link } from '@/lib/router-compat';
import { Clock, Footprints, ArrowUpRight } from 'lucide-react';
import type { Route } from '@/data/types';
import { getCategoryById } from '@/data/content';
import { CategoryIcon } from './CategoryIcon';
import { DemoBadge } from './DemoBadge';

interface RouteCardProps {
  route: Route;
}

const difficultyLabels: Record<string, string> = {
  facil: 'Fácil',
  moderado: 'Moderado',
  intenso: 'Intenso',
};

export function RouteCard({ route }: RouteCardProps) {
  const category = getCategoryById(route.category);

  return (
    <Link
      to={`/rutas/${route.slug}`}
      className="group card-surface overflow-hidden hover:shadow-xl hover:shadow-tinta-900/5 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={route.image}
          alt={route.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta-900/60 via-tinta-900/10 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {category && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-crema-100/95 px-3 py-1.5 text-xs font-semibold text-tinta-700 backdrop-blur-sm">
              <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
              {category.shortName}
            </span>
          )}
          {route.isDemo && <DemoBadge compact />}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-crema-100">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {route.duration}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-crema-200/90">
            {route.subtitle}
          </p>
          <h3 className="mt-0.5 font-serif text-xl font-semibold text-white text-shadow-soft">
            {route.title}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-tinta-500">
          {route.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-tinta-100 pt-3">
          <div className="flex items-center gap-3 text-xs text-tinta-400">
            <span className="inline-flex items-center gap-1.5">
              <Footprints className="h-3.5 w-3.5" /> {route.distance}
            </span>
            <span className="h-1 w-1 rounded-full bg-tinta-200" />
            <span>{difficultyLabels[route.difficulty]}</span>
          </div>
          <ArrowUpRight className="h-4 w-4 text-tinta-300 transition-all duration-300 group-hover:text-terracota-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
