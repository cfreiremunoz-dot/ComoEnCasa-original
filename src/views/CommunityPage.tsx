import { PageHeader } from '@/components/PageHeader';
import { DemoBadge } from '@/components/DemoBadge';
import { communityPosts, categories } from '@/data/content';
import { Heart, MessageCircle, Share2, Sparkles, ImagePlus, PenLine, Route } from 'lucide-react';
import type { CategoryId } from '@/data/types';

const upcomingFeatures = [
  { icon: PenLine, title: 'Compartir recomendaciones', desc: 'Publica tus lugares, experiencias y rincones favoritos.' },
  { icon: ImagePlus, title: 'Subir fotografías', desc: 'Acompaña tus recomendaciones con imágenes de la vida real.' },
  { icon: Route, title: 'Crear y publicar rutas', desc: 'Combina lugares en itinerarios y compártelos con la comunidad.' },
];

export function CommunityPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Espacio participativo"
        title="Comunidad"
        description="Un espacio donde los sevillanos y los visitantes comparten recomendaciones, experiencias, fotografías y rutas. La comunidad es la que hará crecer esta plataforma."
      />

      <div className="container-page pb-20">
        {/* Aviso de funcionalidad próxima */}
        <div className="mb-10 card-surface flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between bg-oliva-50/60 ring-oliva-200/60">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-oliva-100 text-oliva-600">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-serif text-lg font-semibold text-tinta-800">
                La participación está en preparación
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-tinta-500">
                Esta página muestra cómo se verá el espacio comunitario. Pronto podrás publicar, comentar y guardar.
              </p>
            </div>
          </div>
          <DemoBadge />
        </div>

        {/* Funcionalidades próximas */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          {upcomingFeatures.map((f) => (
            <div key={f.title} className="card-surface p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracota-50 text-terracota-500">
                <f.icon className="h-5 w-5" />
              </span>
              <h4 className="mt-3 font-serif text-base font-semibold text-tinta-800">{f.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-tinta-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Publicaciones de demostración */}
        <h2 className="mb-6 font-serif text-xl font-semibold text-tinta-800">
          Ejemplos de publicaciones
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communityPosts.map((post) => {
            const cat = categories.find((c) => c.id === post.category as CategoryId);
            return (
              <article key={post.id} className="card-surface overflow-hidden hover:shadow-lg transition-shadow">
                {post.image && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.imageAlt ?? ''}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    {post.isDemo && <DemoBadge compact className="absolute top-3 right-3" />}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracota-100 text-xs font-semibold text-terracota-700">
                      {post.avatarInitials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-tinta-800">{post.authorDemo}</p>
                      <p className="text-xs text-tinta-400">{post.dateLabel}</p>
                    </div>
                    {cat && (
                      <span className="ml-auto rounded-full bg-crema-200 px-2.5 py-1 text-[11px] font-medium text-tinta-600">
                        {cat.shortName}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-serif text-base font-semibold text-tinta-800">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-tinta-500">
                    {post.body}
                  </p>
                  <div className="mt-4 flex items-center gap-5 border-t border-tinta-100 pt-3 text-xs text-tinta-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Heart className="h-4 w-4" /> {post.likes}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" /> {post.comments}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1.5">
                      <Share2 className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
