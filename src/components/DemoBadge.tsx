import { Info } from 'lucide-react';

interface DemoBadgeProps {
  className?: string;
  compact?: boolean;
}

export function DemoBadge({ className = '', compact = false }: DemoBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-oliva-100 px-2.5 py-1 text-[11px] font-semibold text-oliva-700 ring-1 ring-oliva-300/60 ${className}`}
      title="Contenido de demostración — no verificado"
    >
      <Info className="h-3 w-3" strokeWidth={2.2} />
      {compact ? 'Demo' : 'Ejemplo de demostración'}
    </span>
  );
}
