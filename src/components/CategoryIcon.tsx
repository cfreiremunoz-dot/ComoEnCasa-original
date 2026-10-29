import {
  UtensilsCrossed,
  Home,
  Landmark,
  ShoppingBag,
  Store,
  TreePine,
  Flame,
  Compass,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Home,
  Landmark,
  ShoppingBag,
  Store,
  TreePine,
  Flame,
  Compass,
};

interface CategoryIconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

export function CategoryIcon({ name, className, strokeWidth = 1.75 }: CategoryIconProps) {
  const Icon = iconMap[name] ?? Compass;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
