import { useMemo, useState } from 'react';
import { useParams, Link, Navigate } from '@/lib/router-compat';
import {
  ArrowLeft, ArrowUpRight, Clock, Footprints, LocateFixed, MapPin, Navigation,
  Route as RouteIcon, Flag, Wallet, Lightbulb, Store, UtensilsCrossed,
  Palette, Trees, Users, Landmark, ShoppingBag, Info,
} from 'lucide-react';
import { getRouteBySlug, getPlaceById, getCategoryById } from '@/data/content';
import { DemoBadge } from '@/components/DemoBadge';
import { MapView, type MapMarker } from '@/components/MapView';
import { useGeolocation } from '@/hooks/useGeolocation';
import { haversineDistance, formatDistance } from '@/utils/distance';
import type { RouteStop, StopType } from '@/data/types';

const difficultyLabels: Record<string, string> = {
  facil: 'Fácil',
  moderado: 'Moderado',
  intenso: 'Intenso',
};

const stopTypeLabels: Record<StopType, string> = {
  barrio: 'Barrio',
  mercado: 'Mercado',
  gastronomia: 'Gastronomía',
  comercio: 'Comercio',
  cultural: 'Cultural',
  naturaleza: 'Naturaleza',
  encuentro: 'Lugar de encuentro',
  historia: 'Historia',
};

const stopTypeIcons: Record<StopType, typeof Store> = {
  barrio: Landmark,
  mercado: Store,
  gastronomia: UtensilsCrossed,
  comercio: ShoppingBag,
  cultural: Landmark,
  naturaleza: Trees,
  encuentro: Users,
  historia: Landmark,
};

export function RouteDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const route = slug ? getRouteBySlug(slug) : undefined;
  const geo = useGeolocation();
  const [activeStop, setActiveStop] = useState(0);

  const stopsWithPlaces = useMemo(() => {
    if (!route) return [];
    return route.stops
      .map((stop: RouteStop) => ({ stop, place: getPlaceById(stop.placeId) }))
      .filter((entry) => entry.place)
      .filter((entry) => entry.place?.coords) as Array<{
        stop: RouteStop;
        place: NonNullable<ReturnType<typeof getPlaceById>>;
      }>;
  }, [route]);

  const markers: MapMarker[] = useMemo(
    () => stopsWithPlaces.map(({ stop, place }) => ({
      id: place.id,
      lat: place.coords!.lat,
      lng: place.coords!.lng,
      label: `Parada ${stop.order}: ${place.name}`,
      variant: 'stop' as const,
    })),
    [stopsWithPlaces],
  );

  const routeLine = useMemo(
    () => stopsWithPlaces.map(({ place }) => ({ lat: place.coords!.lat, lng: place.coords!.lng })),
    [stopsWithPlaces],
  );

  if (!route) return <Navigate to="/rutas" replace />;

  const category = getCategoryById(route.category);
  const currentStop = stopsWithPlaces[activeStop];
  const distanceToNext = geo.coords && currentStop?.place.coords
    ? haversineDistance(geo.coords, currentStop.place.coords)
    : null;
  const directionsUrl = currentStop?.place.coords
    ? `https://www.google.com/maps/dir/?api=1&destination=${currentStop.place.coords.lat},${currentStop.place.coords.lng}${geo.coords ? `&origin=${geo.coords.lat},${geo.coords.lng}` : ''}&travelmode=walking`
    : null;

  return (
    <article className="animate-fade-in pt-16">
      <div className="relative h-[50vh] min-h-[380px] w-full overflow-hidden sm:h-[55vh]">
        <img src={route.image} alt={route.imageAlt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta-900/80 via-tinta-900/20 to-tinta-900/30" />
        <div className="absolute inset-0 container-page flex flex-col justify-end pb-10">
          <Link to="/rutas" className="mb-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-crema-200 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Volver a Rutas
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-crema-100/95 px-3 py-1.5 text-xs font-semibold text-tinta-700 backdrop-blur-sm">
                {category.name}
              </span>
            )}
            {route.isDemo && <DemoBadge />}
          </div>
          <p className="mt-3 text-sm font-medium uppercase tracking-wider text-crema-200/90">{route.subtitle}</p>
          <h1 className="mt-1 max-w-3xl font-serif text-4xl font-semibold leading-tight text-white text-shadow-soft sm:text-5xl text-balance">
            {route.title}
          </h1>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="flex flex-wrap gap-5 border-b border-tinta-100 pb-6">
              <div className="flex items-center gap-2 text-sm text-tinta-600">
                <Clock className="h-4 w-4 text-terracota-500" />
                <span>{route.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-tinta-600">
                <Footprints className="h-4 w-4 text-terracota-500" />
                <span>{route.distance}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-tinta-600">
                <RouteIcon className="h-4 w-4 text-terracota-500" />
                <span>{difficultyLabels[route.difficulty]}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-tinta-600">
                <MapPin className="h-4 w-4 text-terracota-500" />
                <span>{route.stops.length} paradas</span>
              </div>
            </div>

            {(route.startPoint || route.endPoint) && (
              <div className="mt-6 flex flex-col gap-3 rounded-xl bg-crema-200/50 p-4 sm:flex-row sm:items-center sm:gap-6">
                {route.startPoint && (
                  <div className="flex items-center gap-2 text-sm text-tinta-600">
                    <Flag className="h-4 w-4 shrink-0 text-terracota-500" />
                    <span><span className="font-semibold text-tinta-700">Inicio:</span> {route.startPoint}</span>
                  </div>
                )}
                {route.endPoint && (
                  <div className="flex items-center gap-2 text-sm text-tinta-600">
                    <Flag className="h-4 w-4 shrink-0 text-granate-600" />
                    <span><span className="font-semibold text-tinta-700">Final:</span> {route.endPoint}</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <h2 className="font-serif text-2xl font-semibold text-tinta-800">Sobre esta ruta</h2>
              <p className="mt-4 text-base leading-relaxed text-tinta-600">{route.description}</p>
            </div>

            <div id="paradas" className="mt-10 scroll-mt-24">
              <h2 className="font-serif text-2xl font-semibold text-tinta-800">Paradas del recorrido</h2>

              {stopsWithPlaces.length === 0 ? (
                <p className="mt-4 text-sm text-tinta-500">
                  Esta ruta incluye lugares cuya ubicación aún no está disponible en el mapa.
                </p>
              ) : (
                <>
                  <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-albero-200 bg-white shadow-sm">
                    <MapView
                      markers={markers}
                      userCoords={geo.coords}
                      routeLine={routeLine}
                      className="h-72 w-full sm:h-80"
                    />
                  </div>

                  {geo.status === 'idle' && (
                    <button
                      onClick={geo.request}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-granate-700 px-4 py-2.5 text-sm font-semibold text-crema-100 transition-colors hover:bg-granate-800"
                    >
                      <LocateFixed className="h-4 w-4" />
                      Mostrar mi posición en el mapa
                    </button>
                  )}
                  {geo.status === 'loading' && (
                    <p className="mt-4 text-sm text-tinta-500">Obteniendo tu ubicación…</p>
                  )}
                  {geo.status === 'denied' && (
                    <p className="mt-4 rounded-lg bg-crema-200/60 px-4 py-3 text-sm leading-relaxed text-tinta-600">
                      Permiso de ubicación denegado. Actívalo desde el icono de la ubicación en la barra del navegador o en los ajustes del sitio para ver tu posición y la distancia hasta la siguiente parada.
                    </p>
                  )}
                  {geo.status === 'unavailable' && (
                    <p className="mt-4 rounded-lg bg-crema-200/60 px-4 py-3 text-sm leading-relaxed text-tinta-600">
                      Tu ubicación no está disponible en este momento. {geo.error}
                    </p>
                  )}
                  {geo.status === 'error' && (
                    <p className="mt-4 rounded-lg bg-crema-200/60 px-4 py-3 text-sm leading-relaxed text-tinta-600">
                      {geo.error} <button onClick={geo.request} className="font-semibold text-terracota-600 hover:text-terracota-700">Reintentar</button>
                    </p>
                  )}
                  {geo.status === 'granted' && (
                    <p className="mt-4 text-xs text-tinta-400">
                      Tu ubicación se usa solo para mostrar tu posición en el mapa. No se guarda ni se comparte.
                    </p>
                  )}

                  <ol className="mt-6 space-y-4">
                    {stopsWithPlaces.map(({ stop, place }, index) => {
                      const isActive = index === activeStop;
                      const StopIcon = stopTypeIcons[stop.stopType] ?? Landmark;
                      return (
                        <li
                          key={stop.order}
                          className={`overflow-hidden rounded-[1.25rem] border transition-colors ${isActive ? 'border-terracota-300 bg-terracota-50/40' : 'border-tinta-100 bg-white'}`}
                        >
                          <div className="p-5">
                            <div className="flex items-start gap-4">
                              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${isActive ? 'bg-terracota-600 text-crema-100' : 'bg-terracota-500 text-crema-100'}`}>
                                {stop.order}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Link to={`/lugar/${place.slug}`} className="font-serif text-lg font-semibold text-tinta-800 transition-colors hover:text-terracota-600">
                                    {place.name}
                                  </Link>
                                  <span className="inline-flex items-center gap-1 rounded-full bg-crema-200/70 px-2.5 py-1 text-[11px] font-semibold text-tinta-600">
                                    <StopIcon className="h-3 w-3" />
                                    {stopTypeLabels[stop.stopType]}
                                  </span>
                                </div>

                                {stop.walkMinutesFromPrevious !== undefined && stop.walkMinutesFromPrevious > 0 && (
                                  <p className="mt-1 flex items-center gap-1 text-xs text-tinta-400">
                                    <Footprints className="h-3 w-3" />
                                    {stop.walkMinutesFromPrevious} min a pie desde la parada anterior
                                  </p>
                                )}

                                <p className="mt-2 text-sm leading-relaxed text-tinta-500">{stop.note}</p>

                                {stop.whatToDo && (
                                  <p className="mt-3 text-sm leading-relaxed text-tinta-600">
                                    <span className="font-semibold text-tinta-700">Qué hacer: </span>
                                    {stop.whatToDo}
                                  </p>
                                )}
                                {stop.whatSpecial && (
                                  <p className="mt-2 text-sm leading-relaxed text-tinta-600">
                                    <span className="font-semibold text-tinta-700">Por qué es especial: </span>
                                    {stop.whatSpecial}
                                  </p>
                                )}
                                {stop.tip && (
                                  <p className="mt-3 flex items-start gap-2 rounded-lg bg-oliva-50 px-3 py-2 text-sm leading-relaxed text-tinta-600">
                                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-oliva-600" />
                                    <span>{stop.tip}</span>
                                  </p>
                                )}

                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                  <Link to={`/lugar/${place.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-terracota-600 transition-colors hover:text-terracota-700">
                                    Ver ficha del lugar
                                    <ArrowUpRight className="h-3 w-3" />
                                  </Link>
                                  <button
                                    onClick={() => setActiveStop(index)}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-tinta-500 transition-colors hover:text-terracota-600"
                                  >
                                    <MapPin className="h-3 w-3" />
                                    {isActive ? 'Parada seleccionada' : 'Seleccionar como próxima'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </>
              )}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card-surface p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-tinta-400">Resumen</h3>
              <dl className="mt-3 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-tinta-500">Duración</dt>
                  <dd className="font-medium text-tinta-800">{route.duration}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-tinta-500">Distancia</dt>
                  <dd className="font-medium text-tinta-800">{route.distance}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-tinta-500">Dificultad</dt>
                  <dd className="font-medium text-tinta-800">{difficultyLabels[route.difficulty]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-tinta-500">Paradas</dt>
                  <dd className="font-medium text-tinta-800">{route.stops.length}</dd>
                </div>
                {route.startPoint && (
                  <div className="flex flex-col gap-0.5 border-t border-tinta-100 pt-2.5">
                    <dt className="text-tinta-500">Inicio</dt>
                    <dd className="text-xs font-medium text-tinta-700">{route.startPoint}</dd>
                  </div>
                )}
                {route.endPoint && (
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-tinta-500">Final</dt>
                    <dd className="text-xs font-medium text-tinta-700">{route.endPoint}</dd>
                  </div>
                )}
              </dl>
            </div>

            {route.budgetNote && (
              <div className="card-surface p-5">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-tinta-400">
                  <Wallet className="h-3.5 w-3.5" />
                  Presupuesto
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-600">{route.budgetNote}</p>
                <p className="mt-2 text-xs text-tinta-400">Datos orientativos, no verificados con cada establecimiento.</p>
              </div>
            )}

            {currentStop && (
              <div className="card-surface p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-tinta-400">Próxima parada</h3>
                <p className="mt-2 font-serif text-base font-semibold text-tinta-800">
                  {currentStop.stop.order}. {currentStop.place.name}
                </p>
                {distanceToNext !== null ? (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-terracota-600">
                    <Navigation className="h-4 w-4" />
                    A {formatDistance(distanceToNext)} de ti
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-tinta-400">
                    Activa tu ubicación para ver la distancia hasta esta parada.
                  </p>
                )}
                {directionsUrl && (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-4 w-full justify-center"
                  >
                    <Navigation className="h-4 w-4" />
                    Abrir indicaciones
                  </a>
                )}
              </div>
            )}

            {stopsWithPlaces.length > 0 && (
              <a href="#paradas" className="btn-secondary w-full justify-center">
                <Footprints className="h-4 w-4" />
                Ver paradas
              </a>
            )}
            <Link to="/rutas" className="btn-secondary w-full justify-center">
              <ArrowLeft className="h-4 w-4" />
              Ver más rutas
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}
