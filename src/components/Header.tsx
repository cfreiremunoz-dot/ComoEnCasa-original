import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from '@/lib/router-compat';
import { Menu, Sparkles, X } from 'lucide-react';

const navItems = [
  { to: '/explora', label: 'Explora' },
  { to: '/rutas', label: 'Rutas' },
  { to: '/experiencias', label: 'Experiencias' },
  { to: '/comunidad', label: 'Comunidad' },
  { to: '/asistente', label: 'Asistente IA', icon: true },
  { to: '/recomendaciones', label: 'Recomendaciones' },
  { to: '/sobre', label: 'Sobre el proyecto' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-crema-100/95 backdrop-blur-md shadow-sm shadow-tinta-900/5'
          : 'bg-crema-100/[0.88] backdrop-blur-md shadow-sm shadow-tinta-900/5'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80" aria-label="Inicio">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-14 sm:w-14">
            <img
              src="/logo-comoencasa-circle.png"
              alt="Logo ComoEnCasa"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-base font-semibold tracking-tight text-tinta-800 sm:text-lg">
              ComoEnCasa
            </span>
            <span className="mt-1 text-[10px] font-medium tracking-wide text-terracota-500 sm:text-[11px]">
              Vive Sevilla, vive ComoEnCasa
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-terracota-50 text-terracota-700'
                    : 'text-tinta-600 hover:bg-crema-200 hover:text-tinta-800'
                }`
              }
            >
              {item.icon ? <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {item.label}</span> : item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-tinta-700 transition-colors hover:bg-crema-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 bg-crema-100 md:hidden">
          <nav className="container-page flex flex-col gap-1 py-6 animate-slide-down">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3.5 text-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-terracota-50 text-terracota-700'
                      : 'text-tinta-700 hover:bg-crema-200'
                  }`
                }
              >
                {item.icon ? <span className="inline-flex items-center gap-2"><Sparkles className="h-5 w-5" /> {item.label}</span> : item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
