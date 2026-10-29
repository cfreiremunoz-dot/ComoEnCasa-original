import { useParams, Link, Navigate } from '@/lib/router-compat';
import { ArrowLeft, ArrowRight, MapPin, Wallet, Tag, Lightbulb, Navigation, Route as RouteIcon } from 'lucide-react';
import {
  getPlaceBySlug,
  getCategoryById,
  getZoneById,
  budgetLabels,
  getRoutesByPlace,
  interests,
} from '@/data/content';
import { DemoBadge } from '@/components/DemoBadge';
import { MapView } from '@/components/MapView';
import { PlaceCard } from '@/components/PlaceCard';
import { RouteCard } from '@/components/RouteCard';
import { places } from '@/data/content';

export function PlaceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const place = slug ? getPlaceBySlug(slug) : undefined;

  if (!place) return <Navigate to="/explora" replace />;

  const category = getCategoryById(place.category);
  const zone = getZoneById(place.zone);
  const relatedRoutes = getRoutesByPlace(place.id);
  const placeInterests = interests.filter((i) => place.interests.includes(i.id));
  const relatedPlaces = places
    .filter((p) => p.id !== place.id && p.category === place.category)
    .slice(0, 3);

  return (
    <article className="animate-fade-in pt-16">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[380px] w-full overflow-hidden sm:h-[60vh]">
        <img src={place.image} alt={place.imageAlt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta-900/80 via-tinta-900/20 to-tinta-900/30" />
        <div className="absolute inset-0 container-page flex flex-col justify-end pb-10">
          <Link
            to="/explora"
            className="mb-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-crema-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Explora
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-crema-100/95 px-3 py-1.5 text-xs font-semibold text-tinta-700 backdrop-blur-sm">
                {category.name}
              </span>
            )}
            {place.isDemo && <DemoBadge />}
          </div>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight text-white text-shadow-soft sm:text-5xl text-balance">
            {place.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-crema-200">
            {place.excerpt}
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            {/* Meta */}
            <div className="flex flex-wrap gap-5 border-b border-tinta-100 pb-6">
              {zone && (
                <div className="flex items-center gap-2 text-sm text-tinta-600">
                  <MapPin className="h-4 w-4 text-terracota-500" />
                  <span>{zone.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-tinta-600">
                <Wallet className="h-4 w-4 text-terracota-500" />
                <span>{budgetLabels[place.budget]}</span>
              </div>
              {place.tags.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-tinta-600">
                  <Tag className="h-4 w-4 text-terracota-500" />
                  <span>{place.tags.join(' · ')}</span>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="mt-8">
              <h2 className="font-serif text-2xl font-semibold text-tinta-800">Sobre este lugar</h2>
              <p className="mt-4 text-base leading-relaxed text-tinta-600">
                {place.description}
              </p>
            </div>

            {/* Consejos */}
            {place.tips.length > 0 && (
              <div className="mt-10">
                <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-tinta-800">
                  <Lightbulb className="h-5 w-5 text-oliva-500" />
                  Consejos de un local
                </h2>
                <ul className="mt-4 space-y-3">
                  {place.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-xl bg-crema-200/50 p-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-oliva-100 text-xs font-semibold text-oliva-700">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-tinta-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rutas relacionadas */}
            {relatedRoutes.length > 0 && (
              <div className="mt-12">
                <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-tinta-800">
                  <RouteIcon className="h-5 w-5 text-terracota-500" />
                  Aparece en estas rutas
                </h2>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  {relatedRoutes.map((route) => (
                    <RouteCard key={route.id} route={route} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {placeInterests.length > 0 && (
              <div className="card-surface p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-tinta-400">
                  Ideal para
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {placeInterests.map((int) => (
                    <span key={int.id} className="chip chip-inactive pointer-events-none">
                      {int.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mapa */}
            <div className="card-surface overflow-hidden">
              {place.coords ? (
                <>
                  <MapView
                    markers={[{ id: place.id, lat: place.coords.lat, lng: place.coords.lng, label: place.name, variant: 'place' }]}
                    center={place.coords}
                    zoom={15}
                    fitToMarkers={false}
                    className="h-56 w-full"
                  />
                  <div className="p-4">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.coords.lat},${place.coords.lng}&travelmode=walking`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracota-600 transition-colors hover:text-terracota-700"
                    >
                      <Navigation className="h-4 w-4" />
                      Cómo llegar
                    </a>
                  </div>
                </>
              ) : (
                <div className="flex aspect-square items-center justify-center bg-crema-200/60 text-center">
                  <div className="px-6">
                    <MapPin className="mx-auto h-8 w-8 text-tinta-300" />
                    <p className="mt-2 text-xs font-medium text-tinta-400">
                      Ubicación no disponible
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Link to="/explora" className="btn-secondary w-full justify-center">
              <ArrowLeft className="h-4 w-4" />
              Ver más lugares
            </Link>
          </aside>
        </div>

        {/* Relacionados */}
        {relatedPlaces.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-semibold text-tinta-800">
              Más de {category?.name}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPlaces.map((p) => (
                <PlaceCard key={p.id} place={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
