import { Check, SlidersHorizontal } from 'lucide-react';
import type { CategoryId, ZoneId, BudgetLevel } from '@/data/types';
import { categories, zones, budgetLabels } from '@/data/content';

export interface FilterState {
  category: CategoryId | 'todas';
  zone: ZoneId | 'todas';
  budget: BudgetLevel | 'todos';
  interests: string[];
}

export const defaultFilters: FilterState = {
  category: 'todas',
  zone: 'todas',
  budget: 'todos',
  interests: [],
};

interface FilterPanelProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
}

const budgets: BudgetLevel[] = ['gratis', 'economico', 'medio', 'alto'];
const allInterests = [
  { id: 'familias', label: 'Con niños' },
  { id: 'parejas', label: 'En pareja' },
  { id: 'solo', label: 'En solitario' },
  { id: 'picnic', label: 'Picnic' },
  { id: 'noche', label: 'De noche' },
  { id: 'lowcost', label: 'Bajo presupuesto' },
  { id: 'fotografia', label: 'Fotografía' },
  { id: 'historia', label: 'Historia' },
  { id: 'gastronomia', label: 'Comida local' },
  { id: 'artesania', label: 'Artesanía' },
  { id: 'accesible', label: 'Accesible' },
  { id: 'lluvia', label: 'Días de lluvia' },
];

export function FilterPanel({ filters, onChange, resultCount }: FilterPanelProps) {
  const toggleInterest = (id: string) => {
    const next = filters.interests.includes(id)
      ? filters.interests.filter((i) => i !== id)
      : [...filters.interests, id];
    onChange({ ...filters, interests: next });
  };

  const reset = () => onChange(defaultFilters);

  const hasActive =
    filters.category !== 'todas' ||
    filters.zone !== 'todas' ||
    filters.budget !== 'todos' ||
    filters.interests.length > 0;

  return (
    <div className="card-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="flex items-center gap-2 font-serif text-base font-semibold text-tinta-800">
          <SlidersHorizontal className="h-4 w-4 text-terracota-500" />
          Filtros
        </h3>
        {hasActive && (
          <button
            onClick={reset}
            className="text-xs font-semibold text-terracota-600 transition-colors hover:text-terracota-700"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-tinta-400">Categoría</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onChange({ ...filters, category: 'todas' })}
              className={`chip ${filters.category === 'todas' ? 'chip-active' : 'chip-inactive'}`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onChange({ ...filters, category: cat.id })}
                className={`chip ${filters.category === cat.id ? 'chip-active' : 'chip-inactive'}`}
              >
                {cat.shortName}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-tinta-400">Zona</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onChange({ ...filters, zone: 'todas' })}
              className={`chip ${filters.zone === 'todas' ? 'chip-active' : 'chip-inactive'}`}
            >
              Toda Sevilla
            </button>
            {zones.map((z) => (
              <button
                key={z.id}
                onClick={() => onChange({ ...filters, zone: z.id })}
                className={`chip ${filters.zone === z.id ? 'chip-active' : 'chip-inactive'}`}
              >
                {z.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-tinta-400">Presupuesto</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onChange({ ...filters, budget: 'todos' })}
              className={`chip ${filters.budget === 'todos' ? 'chip-active' : 'chip-inactive'}`}
            >
              Cualquiera
            </button>
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => onChange({ ...filters, budget: b })}
                className={`chip ${filters.budget === b ? 'chip-active' : 'chip-inactive'}`}
              >
                {budgetLabels[b]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-tinta-400">Intereses</p>
          <div className="flex flex-wrap gap-2">
            {allInterests.map((int) => {
              const active = filters.interests.includes(int.id);
              return (
                <button
                  key={int.id}
                  onClick={() => toggleInterest(int.id)}
                  className={`chip ${active ? 'chip-active' : 'chip-inactive'}`}
                >
                  {active && <Check className="h-3 w-3" />}
                  {int.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-tinta-100 pt-4">
        <p className="text-sm text-tinta-500">
          <span className="font-semibold text-tinta-800">{resultCount}</span>{' '}
          {resultCount === 1 ? 'resultado' : 'resultados'}
        </p>
      </div>
    </div>
  );
}
