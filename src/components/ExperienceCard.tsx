import { Link } from '@/lib/router-compat';
import { Clock, ArrowUpRight } from 'lucide-react';
import type { Experience } from '@/data/types';
import { DemoBadge } from './DemoBadge';

interface ExperienceCardProps {
  experience: Experience;
}

const typeLabels: Record<string, string> = {
  gastronomica: 'Gastronómica',
  cultural: 'Cultural',
  cotidiana: 'Cotidiana',
};

const typeColors: Record<string, string> = {
  gastronomica: 'bg-terracota-100 text-terracota-700',
  cultural: 'bg-oliva-100 text-oliva-700',
  cotidiana: 'bg-albero-200 text-albero-800',
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Link
      to={`/experiencias/${experience.slug}`}
      className="group card-surface overflow-hidden hover:shadow-xl hover:shadow-tinta-900/5 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={experience.image}
          alt={experience.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta-900/30 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${typeColors[experience.type]}`}>
            {typeLabels[experience.type]}
          </span>
          {experience.isDemo && <DemoBadge compact />}
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-terracota-500">
          {experience.subtitle}
        </p>
        <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-tinta-800 transition-colors group-hover:text-terracota-600">
          {experience.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tinta-500">
          {experience.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-tinta-100 pt-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-tinta-400">
            <Clock className="h-3.5 w-3.5" /> {experience.duration}
          </span>
          <ArrowUpRight className="h-4 w-4 text-tinta-300 transition-all duration-300 group-hover:text-terracota-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
