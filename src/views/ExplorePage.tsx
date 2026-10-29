import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from '@/lib/router-compat';
import { ExplorePlaceCard } from '@/components/ExplorePlaceCard';
import { NearbyPlaces } from '@/components/NearbyPlaces';
import { CategoryIcon } from '@/components/CategoryIcon';
import { categories, places, zones } from '@/data/content';
import type { CategoryId, Place, ZoneId } from '@/data/types';

const categoryFilters: Array<{ id: CategoryId | 'todas'; label: string }> = [
  { id: 'todas', label: 'Todo' },
  ...categories.map((category) => ({ id: category.id, label: category.shortName })),
];

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [category, setCategory] = useState<CategoryId | 'todas'>((searchParams.get('categoria') as CategoryId | null) ?? 'todas');
  const [zone, setZone] = useState<ZoneId | 'todas'>((searchParams.get('barrio') as ZoneId | null) ?? 'todas');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    setCategory((searchParams.get('categoria') as CategoryId | null) ?? 'todas');
    setZone((searchParams.get('barrio') as ZoneId | null) ?? 'todas');
  }, [searchParams]);

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return places.filter((place: Place) => {
      const matchesQuery = !normalizedQuery || [
        place.name,
        place.excerpt,
        place.description,
        ...place.tags,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesCategory = category === 'todas' || place.category === category;
      const matchesZone = zone === 'todas' || place.zone === zone;
      return matchesQuery && matchesCategory && matchesZone;
    });
  }, [category, query, zone]);

  const updateUrl = (next: { query?: string; category?: CategoryId | 'todas'; zone?: ZoneId | 'todas' }) => {
    const params = new URLSearchParams(searchParams);
    const nextQuery = next.query ?? query;
    const nextCategory = next.category ?? category;
    const nextZone = next.zone ?? zone;

    if (nextQuery.trim()) params.set('q', nextQuery.trim());
    else params.delete('q');
    if (nextCategory !== 'todas') params.set('categoria', nextCategory);
    else params.delete('categoria');
    if (nextZone !== 'todas') params.set('barrio', nextZone);
    else params.delete('barrio');

    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('todas');
    setZone('todas');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = Boolean(query.trim()) || category !== 'todas' || zone !== 'todas';

  return (
    <div className="animate-fade-in bg-crema-100">
      <section className="border-b border-albero-200/70 bg-albero-100/45 pb-10 pt-32 sm:pb-14 sm:pt-36">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-terracota-600">
              Guía local · Sevilla
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-tinta-800 sm:text-6xl">
              Descubre la Sevilla que se vive
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-tinta-600 sm:text-lg">
              Lugares, sabores y rincones para mirar la ciudad con los ojos de quien la habita.
            </p>
          </div>

          <div className="mt-9 rounded-[1.5rem] bg-crema-100 p-3 shadow-xl shadow-tinta-900/5 ring-1 ring-albero-200 sm:p-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-tinta-400" strokeWidth={1.75} />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  updateUrl({ query: event.target.value });
                }}
                placeholder="Busca un lugar, un barrio o una palabra clave..."
                aria-label="Buscar lugares en Sevilla"
                className="h-14 w-full rounded-xl border border-albero-200 bg-white pl-12 pr-4 text-sm text-tinta-800 placeholder:text-tinta-300 transition-all focus:border-terracota-400 focus:outline-none focus:ring-2 focus:ring-terracota-400/20"
              />
            </div>
            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <span className="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-tinta-400">
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Categoría
                </span>
                {categoryFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      setCategory(filter.id);
                      updateUrl({ category: filter.id });
                    }}
                    className={`chip shrink-0 ${category === filter.id ? 'chip-active' : 'chip-inactive'}`}
                  >
                    {filter.id !== 'todas' && <CategoryIcon name={categories.find((item) => item.id === filter.id)?.icon ?? ''} className="h-3.5 w-3.5" />}
                    {filter.label}
                  </button>
                ))}
              </div>
              <label className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-wider text-tinta-400">
                Barrio
                <select
                  value={zone}
                  onChange={(event) => {
                    const nextZone = event.target.value as ZoneId | 'todas';
                    setZone(nextZone);
                    updateUrl({ zone: nextZone });
                  }}
                  className="rounded-full border border-albero-200 bg-crema-100 px-3 py-2 text-xs font-semibold normal-case tracking-normal text-tinta-700 outline-none focus:border-terracota-400"
                >
                  <option value="todas">Toda Sevilla</option>
                  {zones.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      <NearbyPlaces />

      <main className="container-page py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-serif text-2xl font-semibold text-tinta-800 sm:text-3xl">
              {hasActiveFilters ? 'Resultados para descubrir' : 'Una selección para empezar'}
            </p>
            <p className="mt-1 text-sm text-tinta-500">
              {filteredPlaces.length} {filteredPlaces.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}
            </p>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracota-600 hover:text-terracota-700">
              <X className="h-4 w-4" /> Limpiar filtros
            </button>
          )}
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="rounded-[1.5rem] border border-albero-200 bg-white px-6 py-16 text-center">
            <p className="font-serif text-2xl font-semibold text-tinta-800">No encontramos ese rincón</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-tinta-500">
              Prueba con otro nombre, categoría o barrio para seguir descubriendo Sevilla.
            </p>
            <button onClick={clearFilters} className="btn-secondary mt-6">Ver todos los lugares</button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPlaces.map((place) => <ExplorePlaceCard key={place.id} place={place} />)}
          </div>
        )}
      </main>
    </div>
  );
}
