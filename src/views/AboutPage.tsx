import { Link } from '@/lib/router-compat';
import { PageHeader } from '@/components/PageHeader';
import { ArrowRight, Heart, Users, MapPin, ShoppingBag, Sparkles } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Sobre el proyecto"
        title="ComoEnCasa"
        description="Una plataforma de turismo local para descubrir Sevilla como la viven sus habitantes, dar visibilidad a los pequeños comercios y acercar visitantes y vecinos."
      />

      <div className="container-page pb-20">
        {/* Propuesta */}
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-semibold text-tinta-800 sm:text-3xl">
              Por qué existe este proyecto
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-tinta-600">
              <p>
                Sevilla es una de las ciudades más visitadas de España, pero la mayoría
                de turistas recorre las mismas rutas: la Catedral, la Giralda, el Alcázar,
                la Plaza de España. Son lugares extraordinarios, pero dejan fuera la mayor
                parte de la ciudad —la que sus habitantes viven a diario.
              </p>
              <p>
                <strong className="text-tinta-800">ComoEnCasa</strong> nace para
                cambiar ese enfoque. No queremos competir con las guías tradicionales:
                queremos complementarlas mostrando otra Sevilla. La de los barrios con
                identidad propia, la de los mercados de abastos donde se hace la compra,
                la de los pequeños comercios que mantienen viva la memoria de la ciudad,
                la de las plazas donde se toma el fresco en verano.
              </p>
              <p>
                Creemos que el turismo local no es solo una forma de viajar: es una forma
                de cuidar la ciudad. Cuando los visitantes se acercan a los barrios,
                consumen en los pequeños negocios y conocen las tradiciones, se genera
                una relación más justa entre quienes visitan y quienes habitan.
              </p>
            </div>
          </div>

          <div className="card-surface p-6 self-start">
            <h3 className="font-serif text-base font-semibold text-tinta-800">
              En pocas palabras
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                { icon: Heart, text: 'No es una agencia ni una web de reservas' },
                { icon: MapPin, text: 'Es una guía editorial + una comunidad' },
                { icon: Users, text: 'Conecta visitantes y habitantes' },
                { icon: ShoppingBag, text: 'Da visibilidad al pequeño comercio' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracota-50 text-terracota-500">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm leading-relaxed text-tinta-600">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Valores */}
        <div className="mt-16">
          <h2 className="font-serif text-2xl font-semibold text-tinta-800 sm:text-3xl">
            Lo que nos diferencia
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Lejos del folclore facilón',
                text: 'Mostramos tradiciones y costumbres con respeto, sin reducir la ciudad a tópicos. Sevilla es mucho más que flamenco y Semana Santa: es vida cotidiana.',
              },
              {
                title: 'Pequeños negocios primero',
                text: 'Priorizamos comercios de barrio, talleres artesanos y bares tradicionales sobre grandes cadenas. Ellos son los que dan carácter a la ciudad.',
              },
              {
                title: 'Comunidad y editorial',
                text: 'Combinamos la curaduría del equipo editorial con las recomendaciones de la comunidad. Las dos voces son necesarias y se complementan.',
              },
            ].map((item) => (
              <div key={item.title} className="card-surface p-6">
                <h3 className="font-serif text-lg font-semibold text-tinta-800">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contexto académico */}
        <div className="mt-16 card-surface p-6 sm:p-8 bg-oliva-50/40 ring-oliva-200/50">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-oliva-100 text-oliva-600">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-serif text-xl font-semibold text-tinta-800">
                Un proyecto universitario
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-tinta-600">
                Esta plataforma forma parte de un trabajo de segundo curso del Grado de
                Periodismo y Comunicación. La versión actual es una base visual y funcional
                con datos de ejemplo claramente identificados. Próximas etapas incluirán
                base de datos, cuentas de usuario, favoritos, publicación de rutas,
                comentarios, moderación y un mapa interactivo.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-tinta-500">
                Los contenidos marcados como «ejemplo de demostración» no corresponden a
                lugares, negocios ni datos reales. La información verificada se incorporará
                progresivamente.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="font-serif text-2xl font-semibold text-tinta-800 sm:text-3xl text-balance">
            Empieza a descubrir la otra Sevilla
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/explora" className="btn-primary">
              Explorar lugares
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/rutas" className="btn-secondary">
              Ver rutas locales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
