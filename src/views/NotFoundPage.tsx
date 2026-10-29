import { Link } from '@/lib/router-compat';
import { Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center animate-fade-in">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-terracota-50 text-terracota-500">
        <Compass className="h-8 w-8" />
      </span>
      <h1 className="mt-6 font-serif text-4xl font-semibold text-tinta-800">
        Te has perdido por Sevilla
      </h1>
      <p className="mt-3 max-w-md text-base text-tinta-500">
        Esta página no existe o todavía no está disponible. Vuelve al inicio para seguir descubriendo la ciudad.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">Volver al inicio</Link>
        <Link to="/explora" className="btn-secondary">Explorar lugares</Link>
      </div>
    </div>
  );
}
