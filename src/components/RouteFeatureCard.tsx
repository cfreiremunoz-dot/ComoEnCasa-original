import { Link } from '@/lib/router-compat';
import { ArrowUpRight, Clock, Footprints, MapPin } from 'lucide-react';
import type { Route } from '@/data/types';
import { getCategoryById } from '@/data/content';

interface RouteFeatureCardProps {
  route: Route;
}

const difficultyLabels: Record<string, string> = {
  facil: 'Paseo tranquilo',
  moderado: 'Ritmo medio',
  intenso: 'Recorrido exigente',
};

const experienceLabels: Record<string, string> = {
  barrios: 'Recorrido de barrio',
  gastronomia: 'Ruta gastronómica',
  cultura: 'Itinerario cultural',
  naturaleza: 'Paseo verde',
  comercios: 'Comercios y oficios',
  mercados: 'Ruta de mercados',
  tradiciones: 'Tradiciones sevillanas',
  rincones: 'Rincones ocultos',
};

export function RouteFeatureCard({ route }: RouteFeatureCardProps) {
  const category = getCategoryById(route.category);

  return (
    <Link
      to={`/rutas/${route.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-tinta-100/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-tinta-900/10"
    >
      <div className="relative aspect-[5/4] shrink-0 overflow-hidden bg-albero-100">
        <img
          src={route.image}
          alt={route.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta-900/60 via-tinta-900/10 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-granate-700/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-crema-100 shadow-sm backdrop-blur-sm">
          {experienceLabels[route.category] ?? category?.shortName}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-crema-200/90">
            {route.subtitle}
          </p>
          <h3 className="mt-1 font-serif text-2xl font-semibold leading-tight text-white text-shadow-soft">
            {route.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="line-clamp-3 text-sm leading-relaxed text-tinta-600">
          {route.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-tinta-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-terracota-500" />
            {route.stops.length} paradas
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-terracota-500" />
            {route.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Footprints className="h-4 w-4 text-terracota-500" />
            {route.distance}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-tinta-100 pt-5">
          <span className="text-xs font-medium text-tinta-400">
            {difficultyLabels[route.difficulty]}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracota-600">
            Iniciar recorrido
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
