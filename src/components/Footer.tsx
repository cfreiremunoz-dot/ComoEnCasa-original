import { Link } from '@/lib/router-compat';
import { Mail, Instagram, Send } from 'lucide-react';
import { categories } from '@/data/content';

export function Footer() {
  return (
    <footer className="mt-20 bg-tinta-800 text-crema-200">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">
                <img
                  src="/logo-comoencasa-circle.png"
                  alt="Logo ComoEnCasa"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-serif text-lg font-semibold text-crema-100">
                  ComoEnCasa
                </span>
                <span className="mt-1 text-[11px] font-medium tracking-wide text-terracota-300">
                  Vive Sevilla, vive ComoEnCasa
                </span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-crema-300">
              Una plataforma de turismo local para descubrir Sevilla como la viven sus habitantes.
              Lejos de las rutas masificadas, cerca de la ciudad real.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-crema-400">
              Explora
            </h4>
            <ul className="mt-4 space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/explora?categoria=${cat.id}`}
                    className="text-sm text-crema-300 transition-colors hover:text-terracota-300"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-crema-400">
              Navega
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/rutas" className="text-sm text-crema-300 hover:text-terracota-300">Rutas locales</Link></li>
              <li><Link to="/experiencias" className="text-sm text-crema-300 hover:text-terracota-300">Experiencias</Link></li>
              <li><Link to="/comunidad" className="text-sm text-crema-300 hover:text-terracota-300">Comunidad</Link></li>
              <li><Link to="/sobre" className="text-sm text-crema-300 hover:text-terracota-300">Sobre el proyecto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-crema-400">
              Mantente cerca
            </h4>
            <p className="mt-4 text-sm text-crema-300">
              Próximamente: cuentas de usuario, favoritos y publicación de rutas.
            </p>
            <div className="mt-4 flex gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tinta-700 text-crema-300 transition-colors hover:bg-terracota-500 hover:text-crema-100">
                <Instagram className="h-4 w-4" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tinta-700 text-crema-300 transition-colors hover:bg-terracota-500 hover:text-crema-100">
                <Send className="h-4 w-4" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tinta-700 text-crema-300 transition-colors hover:bg-terracota-500 hover:text-crema-100">
                <Mail className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-tinta-700 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-crema-400">
            Proyecto universitario · Grado de Periodismo y Comunicación · Contenido de demostración
          </p>
          <p className="text-xs text-crema-400">
            Hecho en Sevilla con cariño y datos de ejemplo
          </p>
        </div>
      </div>
    </footer>
  );
}
