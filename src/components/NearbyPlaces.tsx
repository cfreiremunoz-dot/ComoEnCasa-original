import { useMemo, useState } from 'react';
import { Link } from '@/lib/router-compat';
import { LocateFixed, MapPin, Navigation, X } from 'lucide-react';
import { MapView, type MapMarker } from '@/components/MapView';
import { useGeolocation } from '@/hooks/useGeolocation';
import { haversineDistance, formatDistance } from '@/utils/distance';
import { places, getCategoryById } from '@/data/content';
import type { Place } from '@/data/types';

const NEARBY_RADIUS_KM = 5;

export function NearbyPlaces() {
  const geo = useGeolocation();
  const [open, setOpen] = useState(false);

  const nearby = useMemo(() => {
    if (!geo.coords) return [];
    return places
      .filter((place: Place) => Boolean(place.coords))
      .map((place) => ({
        place,
        distance: haversineDistance(geo.coords!, place.coords!),
      }))
      .filter((item) => item.distance <= NEARBY_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance);
  }, [geo.coords]);

  const markers: MapMarker[] = useMemo(
    () => nearby.map(({ place }) => ({
      id: place.id,
      lat: place.coords!.lat,
      lng: place.coords!.lng,
      label: place.name,
      variant: 'place',
    })),
    [nearby],
  );

  if (!open) {
    return (
      <div className="container-page pt-8">
        <button
          onClick={() => {
            setOpen(true);
            geo.request();
          }}
          className="flex w-full items-center justify-between gap-4 rounded-[1.5rem] bg-granate-700 px-5 py-4 text-left text-crema-100 shadow-md transition-all hover:bg-granate-800 hover:shadow-lg sm:px-6 sm:py-5"
        >
          <span className="flex items-center gap-3">
            <LocateFixed className="h-5 w-5 shrink-0 text-crema-200" />
            <span>
              <span className="block font-serif text-lg font-semibold leading-tight sm:text-xl">
                Descubrir cerca de mí
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-crema-200/80">
                Usa tu ubicación para ver qué lugares de Sevilla tienes alrededor.
              </span>
            </span>
          </span>
          <Navigation className="h-5 w-5 shrink-0 text-crema-200" />
        </button>
      </div>
    );
  }

  return (
    <div className="container-page pt-8">
      <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-tinta-100/70">
        <div className="flex items-center justify-between border-b border-tinta-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <LocateFixed className="h-5 w-5 text-terracota-600" />
            <div>
              <p className="font-serif text-lg font-semibold leading-tight text-tinta-800">Cerca de ti</p>
              <p className="text-xs text-tinta-500">Tu ubicación se usa solo para mostrar lugares cercanos. No se guarda ni se comparte.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              geo.reset();
            }}
            className="rounded-full p-2 text-tinta-400 transition-colors hover:bg-tinta-50 hover:text-tinta-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {geo.status === 'loading' && (
            <p className="py-8 text-center text-sm text-tinta-500">Obteniendo tu ubicación…</p>
          )}

          {geo.status === 'denied' && (
            <div className="rounded-xl bg-crema-200/60 p-5 text-sm leading-relaxed text-tinta-600">
              <p className="font-semibold text-tinta-800">Permiso de ubicación denegado</p>
              <p className="mt-2">
                Para activarlo, pulsa el icono de la ubicación en la barra del navegador y concede acceso, o revisa los permisos del sitio en los ajustes de tu navegador. Después vuelve a intentarlo.
              </p>
              <p className="mt-2">Mientras tanto, puedes seguir explorando Sevilla con los filtros y la búsqueda de arriba.</p>
              <button onClick={geo.request} className="btn-secondary mt-4">Reintentar</button>
            </div>
          )}

          {geo.status === 'unavailable' && (
            <div className="rounded-xl bg-crema-200/60 p-5 text-sm leading-relaxed text-tinta-600">
              <p className="font-semibold text-tinta-800">Ubicación no disponible</p>
              <p className="mt-2">{geo.error}</p>
            </div>
          )}

          {geo.status === 'error' && (
            <div className="rounded-xl bg-crema-200/60 p-5 text-sm leading-relaxed text-tinta-600">
              <p className="font-semibold text-tinta-800">No pudimos obtener tu ubicación</p>
              <p className="mt-2">{geo.error}</p>
              <button onClick={geo.request} className="btn-secondary mt-4">Reintentar</button>
            </div>
          )}

          {geo.status === 'granted' && geo.coords && (
            <div className="space-y-5">
              {nearby.length === 0 ? (
                <p className="py-6 text-center text-sm text-tinta-500">
                  No hay lugares catalogados en un radio de {NEARBY_RADIUS_KM} km. Puedes seguir explorando Sevilla con los filtros de arriba.
                </p>
              ) : (
                <>
                  <MapView
                    markers={markers}
                    userCoords={geo.coords}
                    center={geo.coords}
                    zoom={14}
                    className="h-64 w-full overflow-hidden rounded-xl border border-albero-200 sm:h-72"
                  />
                  <ul className="divide-y divide-tinta-100">
                    {nearby.map(({ place, distance }) => {
                      const category = getCategoryById(place.category);
                      return (
                        <li key={place.id} className="flex items-center justify-between gap-4 py-3.5">
                          <Link to={`/lugar/${place.slug}`} className="group min-w-0 flex-1">
                            <p className="truncate font-serif text-base font-semibold text-tinta-800 transition-colors group-hover:text-terracota-600">
                              {place.name}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-tinta-500">
                              {category && <span>{category.shortName}</span>}
                              <span className="h-1 w-1 rounded-full bg-tinta-200" />
                              <span className="inline-flex items-center gap-1 font-semibold text-terracota-600">
                                <MapPin className="h-3 w-3" />
                                {formatDistance(distance)}
                              </span>
                            </p>
                          </Link>
                          <Link
                            to={`/lugar/${place.slug}`}
                            className="shrink-0 rounded-full bg-crema-200/60 px-3 py-1.5 text-xs font-semibold text-tinta-700 transition-colors hover:bg-terracota-100 hover:text-terracota-700"
                          >
                            Ver ficha
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
