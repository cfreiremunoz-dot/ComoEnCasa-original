export type CategoryId =
  | 'gastronomia'
  | 'barrios'
  | 'cultura'
  | 'comercios'
  | 'mercados'
  | 'naturaleza'
  | 'tradiciones'
  | 'rincones';

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
}

export type ZoneId =
  | 'centro'
  | 'triana'
  | 'macarena'
  | 'nervion'
  | 'sur'
  | 'este'
  | 'norte'
  | 'aljarafe';

export interface Zone {
  id: ZoneId;
  name: string;
}

export type BudgetLevel = 'gratis' | 'economico' | 'medio' | 'alto';

export type DemoTag = 'demo';

export interface Place {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  zone: ZoneId;
  budget: BudgetLevel;
  tags: string[];
  image: string;
  imageAlt: string;
  excerpt: string;
  description: string;
  tips: string[];
  interests: string[];
  isDemo: boolean;
  routeIds?: string[];
  coords?: { lat: number; lng: number };
}

export type StopType =
  | 'barrio'
  | 'mercado'
  | 'gastronomia'
  | 'comercio'
  | 'cultural'
  | 'naturaleza'
  | 'encuentro'
  | 'historia';

export interface RouteStop {
  order: number;
  placeId: string;
  note: string;
  stopType: StopType;
  whatToDo?: string;
  whatSpecial?: string;
  tip?: string;
  walkMinutesFromPrevious?: number;
}

export interface Route {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  category: CategoryId;
  duration: string;
  distance: string;
  difficulty: 'facil' | 'moderado' | 'intenso';
  description: string;
  stops: RouteStop[];
  isDemo: boolean;
  authorDemo?: string;
  startPoint?: string;
  endPoint?: string;
  budgetNote?: string;
  warnings?: string[];
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  type: 'gastronomica' | 'cultural' | 'cotidiana';
  duration: string;
  description: string;
  highlights: string[];
  isDemo: boolean;
}

export interface CommunityPost {
  id: string;
  authorDemo: string;
  avatarInitials: string;
  category: CategoryId;
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
  likes: number;
  comments: number;
  dateLabel: string;
  isDemo: boolean;
}

export interface Interest {
  id: string;
  label: string;
}
