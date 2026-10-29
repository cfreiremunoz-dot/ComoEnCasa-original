import { useParams, Link, Navigate } from '@/lib/router-compat';
import { ArrowLeft, Clock, Check } from 'lucide-react';
import { getExperienceBySlug } from '@/data/content';
import { DemoBadge } from '@/components/DemoBadge';

const typeLabels: Record<string, string> = {
  gastronomica: 'Gastronómica',
  cultural: 'Cultural',
  cotidiana: 'Cotidiana',
};

export function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const exp = slug ? getExperienceBySlug(slug) : undefined;

  if (!exp) return <Navigate to="/experiencias" replace />;

  return (
    <article className="animate-fade-in pt-16">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[380px] w-full overflow-hidden sm:h-[55vh]">
        <img src={exp.image} alt={exp.imageAlt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta-900/80 via-tinta-900/20 to-tinta-900/30" />
        <div className="absolute inset-0 container-page flex flex-col justify-end pb-10">
          <Link
            to="/experiencias"
            className="mb-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-crema-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Experiencias
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-terracota-500 px-3 py-1.5 text-xs font-semibold text-crema-100">
              {typeLabels[exp.type]}
            </span>
            {exp.isDemo && <DemoBadge />}
          </div>
          <p className="mt-3 text-sm font-medium uppercase tracking-wider text-crema-200/90">
            {exp.subtitle}
          </p>
          <h1 className="mt-1 max-w-3xl font-serif text-4xl font-semibold leading-tight text-white text-shadow-soft sm:text-5xl text-balance">
            {exp.title}
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="flex items-center gap-2 text-sm text-tinta-600 border-b border-tinta-100 pb-6">
              <Clock className="h-4 w-4 text-terracota-500" />
              <span>{exp.duration}</span>
            </div>

            <div className="mt-8">
              <h2 className="font-serif text-2xl font-semibold text-tinta-800">De qué se trata</h2>
              <p className="mt-4 text-base leading-relaxed text-tinta-600">
                {exp.description}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="font-serif text-2xl font-semibold text-tinta-800">Lo que la define</h2>
              <ul className="mt-4 space-y-3">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl bg-crema-200/50 p-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-oliva-100 text-oliva-700">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm leading-relaxed text-tinta-600">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <Link to="/experiencias" className="btn-secondary w-full justify-center">
              <ArrowLeft className="h-4 w-4" />
              Ver más experiencias
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}
