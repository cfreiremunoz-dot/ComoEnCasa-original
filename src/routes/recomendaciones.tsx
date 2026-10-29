import { createFileRoute, Link } from '@tanstack/react-router';
import { RecommendationCard } from '@/components/RecommendationCard';
import { useRecommendations } from '@/lib/recommendations';

export const Route = createFileRoute('/recomendaciones')({
  head: () => ({
    meta: [
      { title: 'Recomendaciones de la comunidad · ComoEnCasa' },
      { name: 'description', content: 'Lugares de Sevilla recomendados por vecinos y visitantes de ComoEnCasa.' },
      { property: 'og:title', content: 'Recomendaciones de la comunidad · ComoEnCasa' },
      { property: 'og:description', content: 'Lugares de Sevilla recomendados por vecinos y visitantes de ComoEnCasa.' },
    ],
  }),
  component: Page,
});

function Page() {
  const { data, isLoading } = useRecommendations('approved');
  return (
    <div className="container-page pb-20 pt-28 sm:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-tinta-800">Recomendaciones</h1>
          <p className="mt-2 text-tinta-600">Rincones de Sevilla que nos ha contado la gente.</p>
        </div>
        <Link to="/recomendar" className="rounded-full bg-terracota-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracota-600">
          Recomienda un sitio
        </Link>
      </div>
      {isLoading ? (
        <p className="mt-10 text-tinta-500">Cargando…</p>
      ) : data?.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((r) => <RecommendationCard key={r.id} r={r} />)}
        </div>
      ) : (
        <p className="mt-10 text-tinta-500">Todavía no hay recomendaciones. ¡Sé la primera persona!</p>
      )}
    </div>
  );
}
