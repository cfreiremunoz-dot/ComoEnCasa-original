import { useMemo, useState } from 'react';
import { Link } from '@/lib/router-compat';
import { ArrowDown, ArrowRight, Compass, Heart, Search, Users } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { RouteCard } from '@/components/RouteCard';
import { ExperienceCard } from '@/components/ExperienceCard';
import { places, routes, experiences, heroImageSecondary } from '@/data/content';
import heroPlazaEspana from '@/assets/hero-plaza-espana.jpg';
import { useSiteTexts } from '@/lib/recommendations';

const discoveryBlocks = [
  {
    category: 'barrios',
    label: 'Barrios',
    title: 'Donde Sevilla baja el ritmo',
    description: 'Calles con acento propio, plazas vividas y vecinos que hacen barrio.',
    image: heroImageSecondary,
    alt: 'Fachadas coloridas de Triana junto al Guadalquivir',
    className: 'md:col-span-7 md:row-span-2',
  },
  {
    category: 'gastronomia',
    label: 'Gastronomía',
    title: 'A la mesa, sin prisa',
    description: 'Barras, mercados y sabores que cuentan una ciudad.',
    image: 'https://images.pexels.com/photos/14009280/pexels-photo-14009280.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Tapas variadas sobre una mesa de madera',
    className: 'md:col-span-5',
  },
  {
    category: 'cultura',
    label: 'Cultura',
    title: 'La memoria sigue aquí',
    description: 'Museos, azulejos y espacios para mirar más despacio.',
    image: 'https://images.pexels.com/photos/12838145/pexels-photo-12838145.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Columnas y azulejos en un jardín sevillano',
    className: 'md:col-span-5',
  },
  {
    category: 'comercios',
    label: 'Pequeños comercios',
    title: 'Hecho cerca de casa',
    description: 'Oficios, talleres y tiendas con algo que contar.',
    image: 'https://images.pexels.com/photos/27905345/pexels-photo-27905345.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Puerta tradicional española con cerámica artesanal',
    className: 'md:col-span-5',
  },
  {
    category: 'rincones',
    label: 'Rincones locales',
    title: 'Lo que no sale en el mapa',
    description: 'Pequeños hallazgos para perderse con intención.',
    image: 'https://images.pexels.com/photos/40244095/pexels-photo-40244095.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Calle empedrada y tranquila de Sevilla',
    className: 'md:col-span-7',
  },
];

interface HomeSearchResult {
  type: 'lugar' | 'experiencia';
  title: string;
  subtitle: string;
  slug: string;
  image: string;
  imageAlt: string;
}

export function HomePage() {
  const siteTexts = useSiteTexts();
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const searchResults = useMemo<HomeSearchResult[]>(() => {
    const query = submittedQuery.toLowerCase().trim();
    if (!query) return [];

    const placeResults: HomeSearchResult[] = places
      .filter((place) => [place.name, place.excerpt, place.description, ...place.tags].some((value) => value.toLowerCase().includes(query)))
      .map((place) => ({
        type: 'lugar',
        title: place.name,
        subtitle: place.excerpt,
        slug: `/lugar/${place.slug}`,
        image: place.image,
        imageAlt: place.imageAlt,
      }));

    const experienceResults: HomeSearchResult[] = experiences
      .filter((experience) => [experience.title, experience.subtitle, experience.description, ...experience.highlights].some((value) => value.toLowerCase().includes(query)))
      .map((experience) => ({
        type: 'experiencia',
        title: experience.title,
        subtitle: experience.subtitle,
        slug: `/experiencias/${experience.slug}`,
        image: experience.image,
        imageAlt: experience.imageAlt,
      }));

    return [...placeResults, ...experienceResults].slice(0, 6);
  }, [submittedQuery]);

  const showSearchResults = submittedQuery.length > 0;

  return (
    <div className="animate-fade-in overflow-hidden">
      <section className="relative flex min-h-[min(760px,100svh)] items-end overflow-hidden bg-tinta-800">
        <img
          src={heroPlazaEspana}
          alt="Plaza de España de Sevilla al atardecer"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta-900/90 via-tinta-900/35 to-tinta-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-tinta-900/55 via-transparent to-transparent" />

        <div className="container-page relative z-10 w-full pb-12 pt-32 sm:pb-16 lg:pb-20">
          <div className="max-w-4xl">
            <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-crema-200">
              <span className="h-px w-8 bg-terracota-300" /> Turismo local · Sevilla
            </p>
            <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1] tracking-tight text-white text-shadow-soft sm:text-6xl lg:text-7xl">
              {siteTexts.hero_title_1}
              <br />
              <span className="text-terracota-300">{siteTexts.hero_title_2}</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-crema-200 sm:text-lg">
              {siteTexts.hero_subtitle}
            </p>

            <div className="mt-8 max-w-2xl sm:mt-10">
              <SearchBar
                variant="hero"
                placeholder="¿Qué quieres vivir en Sevilla?"
                onQueryChange={setSearchQuery}
                onSearch={setSubmittedQuery}
              />
              <div className="mt-3 flex items-center gap-2 text-xs text-crema-300">
                <Search className="h-3.5 w-3.5" />
                Busca un barrio, un sabor o un rincón
              </div>
              {showSearchResults && (
                <div className="mt-4 overflow-hidden rounded-2xl bg-crema-100 p-2 text-left shadow-2xl shadow-tinta-900/25 ring-1 ring-white/30">
                  {searchResults.length > 0 ? (
                    <div className="grid gap-1 sm:grid-cols-2">
                      {searchResults.map((result) => (
                        <Link
                          key={`${result.type}-${result.slug}`}
                          to={result.slug}
                          className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-crema-200"
                        >
                          <img src={result.image} alt={result.imageAlt} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                          <span className="min-w-0">
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-terracota-600">{result.type}</span>
                            <span className="block truncate font-serif text-sm font-semibold text-tinta-800 group-hover:text-terracota-600">{result.title}</span>
                            <span className="block truncate text-xs text-tinta-500">{result.subtitle}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="px-4 py-3 text-sm text-tinta-600">
                      No encontramos lugares ni experiencias para «{searchQuery.trim()}». Prueba con otro término.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-white/20 pt-5 text-xs text-crema-300 sm:mt-16">
            <span className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-terracota-300" />
              Vive Sevilla, vive ComoEnCasa
            </span>
            <span className="hidden items-center gap-2 sm:flex">
              Desliza para explorar <ArrowDown className="h-4 w-4" />
            </span>
          </div>
        </div>
      </section>

      <section className="bg-crema-100 py-20 sm:py-28">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota-500">
                Una ciudad, muchas formas de vivirla
              </p>
              <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-tinta-800 sm:text-5xl">
                Encuentra tu Sevilla.
              </h2>
            </div>
            <Link to="/explora" className="group inline-flex items-center gap-2 text-sm font-semibold text-terracota-600">
              Explorar todo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid auto-rows-[220px] gap-4 sm:auto-rows-[250px] md:grid-cols-12 md:grid-rows-2">
            {discoveryBlocks.map((block) => (
              <Link
                key={block.category}
                to={`/explora?categoria=${block.category}`}
                className={`group relative overflow-hidden rounded-[1.5rem] bg-tinta-800 ${block.className}`}
              >
                <img
                  src={block.image}
                  alt={block.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tinta-900/85 via-tinta-900/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-terracota-300">
                    {block.label}
                  </p>
                  <h3 className="font-serif text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    {block.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-crema-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {block.description}
                  </p>
                </div>
                <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-albero-100/60 py-20 sm:py-28">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="aspect-[4/5] overflow-hidden rounded-[2rem]">
                <img
                  src={heroImageSecondary}
                  alt="Fachadas coloridas de Triana junto al río"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-4 flex items-center gap-3 rounded-2xl bg-crema-100 px-4 py-3 shadow-xl sm:-right-8">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracota-500 text-crema-100">
                  <Heart className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold leading-tight text-tinta-700">
                  Hecho para<br />descubrir despacio
                </span>
              </div>
            </div>
            <div className="max-w-xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota-600">
                La otra guía de Sevilla
              </p>
              <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-tinta-800 sm:text-5xl">
                Más que una lista de lugares.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-tinta-600">
                Conectamos a quienes llegan con quienes hacen ciudad: barrios, comercios pequeños, sabores y costumbres que merecen ser compartidos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/sobre" className="btn-primary">
                  Conoce el proyecto <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/comunidad" className="btn-secondary">
                  <Users className="h-4 w-4" /> Comunidad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-crema-100 py-20 sm:py-28">
        <div className="container-page">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota-500">A pie, sin prisa</p>
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-tinta-800 sm:text-5xl">Rutas con otra mirada</h2>
            </div>
            <Link to="/rutas" className="group hidden items-center gap-2 text-sm font-semibold text-terracota-600 sm:flex">
              Ver rutas <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {routes.slice(0, 2).map((route) => <RouteCard key={route.id} route={route} />)}
          </div>
        </div>
      </section>

      <section className="bg-granate-900 py-20 text-crema-100 sm:py-28">
        <div className="container-page">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota-300">Costumbres e identidad</p>
              <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-5xl">Vivir Sevilla también es esto.</h2>
            </div>
            <Link to="/experiencias" className="group hidden items-center gap-2 text-sm font-semibold text-terracota-300 sm:flex">
              Ver experiencias <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.slice(0, 3).map((experience) => <ExperienceCard key={experience.id} experience={experience} />)}
          </div>
        </div>
      </section>

      <section className="bg-tinta-800 py-16 text-center sm:py-20">
        <div className="container-page">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota-300">ComoEnCasa</p>
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-semibold leading-tight text-crema-100 sm:text-5xl">
            La ciudad empieza donde termina la ruta.
          </h2>
          <Link to="/explora" className="btn-primary mt-8">
            Empieza a explorar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
