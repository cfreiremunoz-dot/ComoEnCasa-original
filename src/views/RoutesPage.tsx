import { Footprints } from 'lucide-react';
import { RouteFeatureCard } from '@/components/RouteFeatureCard';
import { routes } from '@/data/content';

export function RoutesPage() {
  return (
    <div className="animate-fade-in bg-crema-100">
      <section className="border-b border-albero-200/70 bg-albero-100/40 pb-12 pt-32 sm:pb-16 sm:pt-36">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-granate-700">
              <Footprints className="h-4 w-4" />
              Itinerarios locales
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-tinta-800 sm:text-6xl">
              Sevilla, paso a paso
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-tinta-600 sm:text-lg">
              Recorridos pensados para ir despacio, lejos del circuito turístico, siguiendo el ritmo de quien vive aquí.
            </p>
          </div>
        </div>
      </section>

      <main className="container-page py-12 sm:py-16">
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {routes.map((route) => (
            <RouteFeatureCard key={route.id} route={route} />
          ))}
        </div>
      </main>
    </div>
  );
}
