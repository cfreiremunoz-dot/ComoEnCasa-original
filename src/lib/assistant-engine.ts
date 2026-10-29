import { places, routes, experiences, categories, zones } from '@/data/content';
import type { Place, Route, Experience } from '@/data/types';

export interface AssistantRecommendation {
  kind: 'lugar' | 'ruta' | 'experiencia';
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  href: string;
  reason: string;
}

export interface AssistantResponse {
  text: string;
  recommendations: AssistantRecommendation[];
}

interface IntentKeywords {
  [key: string]: string[];
}

const intentKeywords: IntentKeywords = {
  comer: ['comer', 'tapear', 'tapa', 'tapas', 'bar', 'barra', 'bodega', 'tapeo', 'gastronomia', 'gastronomía', 'comida', 'cenar', 'almorzar', 'desayunar', 'desayuno', 'tostada', 'churros', 'mercado', 'pescado', 'jamón', 'jamon', 'queso', 'gilda', 'picar', 'bocadillo'],
  cultura: ['cultura', 'museo', 'arte', 'pintura', 'murillo', 'zurbarán', 'zurbaran', 'catedral', 'giralda', 'historia', 'monumento', 'patrimonio', 'convento', 'iglesia', 'claustro'],
  naturaleza: ['parque', 'naturaleza', 'arbol', 'árbol', 'jardín', 'jardin', 'verde', 'río', 'rio', 'guadalquivir', 'pasear', 'paseo', 'respirar', 'tranquilo', 'sombra', 'plátano', 'plátanos'],
  compras: ['comprar', 'compra', 'tienda', 'comercio', 'artesanía', 'artesania', 'cerámica', 'ceramica', 'azulejo', 'oficio', 'taller', 'regalo', 'recuerdo', 'mercado', 'artesano'],
  barrio: ['barrio', 'barrios', 'calle', 'plaza', 'vecinos', 'vida', 'cotidiano', 'auténtico', 'autentico', 'local', 'real', 'gentes', 'triana', 'macarena', 'alameda', 'centro', 'feria'],
  ruta: ['ruta', 'recorrido', 'caminar', 'andar', 'plan', 'itinerario', 'mañana', 'tarde', 'día', 'dia', 'completo', 'media jornada', 'paseo guiado'],
  experiencia: ['experiencia', 'vivir', 'hacer', 'actividad', 'disfrutar', 'sentir', 'costumbre', 'tradición', 'tradicion', 'oficio', 'manos', 'aprender'],
  familias: ['niños', 'niño', 'niñas', 'niña', 'familia', 'familias', 'con niños', 'infantil', 'menores', 'peques'],
  economico: ['barato', 'barata', 'económico', 'economico', 'lowcost', 'presupuesto', 'gratis', 'gratuito', 'asequible', 'baratito'],
  pareja: ['pareja', 'romántico', 'romantico', 'romance', 'cita', 'enamorados', 'dos personas'],
  noche: ['noche', 'nocturno', 'tarde', 'atardecer', 'caer la tarde', 'cenar', 'copa', 'copas', 'música', 'musica'],
  lluvia: ['lluvia', 'llover', 'lluvioso', 'interior', 'cubierto', 'techo', 'refugio'],
  fotografia: ['foto', 'fotografía', 'fotografia', 'fotografías', 'fotografias', 'cámara', 'camara', 'sacar fotos', 'instantánea', 'recuerdo'],
};

const zoneKeywords: Record<string, string[]> = {
  centro: ['centro', 'catedral', 'giralda', 'ayuntamiento', 'plaza nueva', 'alfalfa', 'encarnación', 'encarnacion', 'setas', 'parasol', 'bellas artes', 'torre del oro'],
  triana: ['triana', 'betis', 'pureza', 'san jorge', 'alfarero', 'alfareros', 'ceramica', 'cerámica', 'guadalquivir triana', 'puente isabel', 'puente de triana'],
  macarena: ['macarena', 'alameda', 'hércules', 'hercules', 'feria', 'omnium', 'san leandro', 'san gil'],
  sur: ['maría luisa', 'maria luisa', 'plaza de españa', 'plaza de espana', 'delicias', 'sur', 'iberoamericana'],
  nervion: ['nervión', 'nervion', 'este', 'prado', 'santa justa'],
  norte: ['norte', 'alamillo', 'san jerónimo', 'pino montano'],
  aljarafe: ['aljarafe', 'mairena', 'tomares', 'gines', 'bormujos', 'castilleja'],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function scorePlace(place: Place, query: string): number {
  const q = normalize(query);
  let score = 0;
  const name = normalize(place.name);
  const excerpt = normalize(place.excerpt);
  const desc = normalize(place.description);
  const tags = place.tags.map(normalize);
  const interests = place.interests.map(normalize);

  if (name.includes(q)) score += 10;
  if (excerpt.includes(q)) score += 6;
  if (desc.includes(q)) score += 3;
  for (const tag of tags) if (tag.includes(q)) score += 5;
  for (const interest of interests) if (interest.includes(q)) score += 4;

  for (const [intent, words] of Object.entries(intentKeywords)) {
    for (const word of words) {
      const w = normalize(word);
      if (q.includes(w)) {
        if (place.tags.map(normalize).some(t => t.includes(w))) score += 3;
        if (interests.some(i => i.includes(intent) || i.includes(w))) score += 4;
        if (place.category === intent || place.tags.map(normalize).some(t => t.includes(intent))) score += 2;
      }
    }
  }

  for (const [zoneId, words] of Object.entries(zoneKeywords)) {
    for (const word of words) {
      if (q.includes(normalize(word)) && place.zone === zoneId) {
        score += 8;
      }
    }
  }

  return score;
}

function scoreRoute(route: Route, query: string): number {
  const q = normalize(query);
  let score = 0;
  const title = normalize(route.title);
  const subtitle = normalize(route.subtitle);
  const desc = normalize(route.description);
  const category = normalize(route.category);

  if (title.includes(q)) score += 10;
  if (subtitle.includes(q)) score += 6;
  if (desc.includes(q)) score += 3;

  for (const [intent, words] of Object.entries(intentKeywords)) {
    for (const word of words) {
      const w = normalize(word);
      if (q.includes(w)) {
        if (category.includes(intent)) score += 4;
        if (desc.includes(w)) score += 3;
      }
    }
  }

  const queryWords = q.split(/\s+/).filter(w => w.length > 3);
  for (const stop of route.stops) {
    const place = places.find(p => p.id === stop.placeId);
    if (place) {
      const placeName = normalize(place.name);
      for (const qw of queryWords) {
        if (placeName.includes(qw)) score += 2;
      }
    }
  }

  return score;
}

function scoreExperience(exp: Experience, query: string): number {
  const q = normalize(query);
  let score = 0;
  const title = normalize(exp.title);
  const subtitle = normalize(exp.subtitle);
  const desc = normalize(exp.description);
  const type = normalize(exp.type);

  if (title.includes(q)) score += 10;
  if (subtitle.includes(q)) score += 6;
  if (desc.includes(q)) score += 3;

  for (const [intent, words] of Object.entries(intentKeywords)) {
    for (const word of words) {
      const w = normalize(word);
      if (q.includes(w)) {
        if (type.includes(intent)) score += 4;
        if (desc.includes(w)) score += 3;
        for (const hl of exp.highlights) {
          if (normalize(hl).includes(w)) score += 2;
        }
      }
    }
  }

  return score;
}

function detectIntents(query: string): string[] {
  const q = normalize(query);
  const detected: string[] = [];
  for (const [intent, words] of Object.entries(intentKeywords)) {
    for (const word of words) {
      if (q.includes(normalize(word))) {
        if (!detected.includes(intent)) detected.push(intent);
        break;
      }
    }
  }
  return detected;
}

function detectZones(query: string): string[] {
  const q = normalize(query);
  const detected: string[] = [];
  for (const [zoneId, words] of Object.entries(zoneKeywords)) {
    for (const word of words) {
      if (q.includes(normalize(word))) {
        if (!detected.includes(zoneId)) detected.push(zoneId);
        break;
      }
    }
  }
  return detected;
}

function buildRecommendations(query: string, maxTotal = 4): AssistantRecommendation[] {
  const placeScores = places.map(p => ({ item: p, score: scorePlace(p, query) }));
  const routeScores = routes.map(r => ({ item: r, score: scoreRoute(r, query) }));
  const expScores = experiences.map(e => ({ item: e, score: scoreExperience(e, query) }));

  const topPlaces = placeScores.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
  const topRoutes = routeScores.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 1);
  const topExps = expScores.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 1);

  let recs: AssistantRecommendation[] = [];

  for (const { item } of topPlaces) {
    recs.push({
      kind: 'lugar',
      slug: item.slug,
      title: item.name,
      subtitle: item.excerpt,
      image: item.image,
      imageAlt: item.imageAlt,
      href: `/lugar/${item.slug}`,
      reason: reasonForPlace(item, query),
    });
  }

  for (const { item } of topRoutes) {
    recs.push({
      kind: 'ruta',
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      image: item.image,
      imageAlt: item.imageAlt,
      href: `/rutas/${item.slug}`,
      reason: reasonForRoute(item, query),
    });
  }

  for (const { item } of topExps) {
    recs.push({
      kind: 'experiencia',
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      image: item.image,
      imageAlt: item.imageAlt,
      href: `/experiencias/${item.slug}`,
      reason: reasonForExperience(item, query),
    });
  }

  if (recs.length === 0) {
    const fallback = places.filter(p => p.isDemo).slice(0, 2);
    for (const item of fallback) {
      recs.push({
        kind: 'lugar',
        slug: item.slug,
        title: item.name,
        subtitle: item.excerpt,
        image: item.image,
        imageAlt: item.imageAlt,
        href: `/lugar/${item.slug}`,
        reason: 'Un buen punto de partida para empezar a descubrir Sevilla.',
      });
    }
  }

  return recs.slice(0, maxTotal);
}

function reasonForPlace(place: Place, query: string): string {
  const intents = detectIntents(query);
  const zones = detectZones(query);
  const parts: string[] = [];

  if (zones.length > 0) {
    const zoneName = zones.find(z => place.zone === z);
    if (zoneName) parts.push(`está en la zona que mencionas`);
  }
  if (intents.includes('comer') && (place.category === 'gastronomia' || place.tags.map(normalize).some(t => t.includes('gastronom')))) {
    parts.push('encaja con tu interés gastronómico');
  }
  if (intents.includes('familias') && place.interests.map(normalize).some(i => i.includes('familia'))) {
    parts.push('es apto para ir con niños');
  }
  if (intents.includes('noche') && place.interests.map(normalize).some(i => i.includes('noche'))) {
    parts.push('brilla especialmente de noche');
  }
  if (intents.includes('economico') && (place.budget === 'gratis' || place.budget === 'economico')) {
    parts.push('es una opción asequible');
  }
  if (intents.includes('fotografia') && place.interests.map(normalize).some(i => i.includes('fotografi'))) {
    parts.push('es un lugar muy fotogénico');
  }
  if (intents.includes('naturaleza') && place.category === 'naturaleza') {
    parts.push('es un espacio verde ideal para relajarse');
  }
  if (intents.includes('cultura') && place.category === 'cultura') {
    parts.push('es un espacio cultural con historia');
  }
  if (intents.includes('compras') && place.category === 'comercios') {
    parts.push('es un comercio con oficio e identidad');
  }

  if (parts.length === 0) {
    return `Encaja con lo que buscas: ${place.excerpt.toLowerCase()}`;
  }

  return parts.slice(0, 2).join(' y ') + '.';
}

function reasonForRoute(route: Route, query: string): string {
  const intents = detectIntents(query);
  if (intents.includes('comer')) return 'Una ruta pensada para descubrir la gastronomía sevillana de barrio en barrio.';
  if (intents.includes('cultura')) return 'Un recorrido que mira la ciudad con ojos culturales e históricos.';
  if (intents.includes('naturaleza')) return 'Un paseo por los espacios más verdes y tranquilos de Sevilla.';
  if (intents.includes('compras')) return 'Una ruta por oficios, talleres y pequeños comercios con historia.';
  return `Una ruta completa: ${route.subtitle.toLowerCase()}`;
}

function reasonForExperience(exp: Experience, query: string): string {
  const intents = detectIntents(query);
  if (intents.includes('comer')) return 'Una experiencia gastronómica para vivir la ciudad desde la mesa.';
  if (intents.includes('cultura')) return 'Una experiencia cultural para entender Sevilla desde dentro.';
  if (intents.includes('familias')) return 'Una experiencia que se puede disfrutar en familia.';
  return `Una experiencia auténtica: ${exp.subtitle.toLowerCase()}`;
}

function buildText(query: string, recs: AssistantRecommendation[]): string {
  const intents = detectIntents(query);
  const zones = detectZones(query);

  let intro = '';

  if (recs.length === 0) {
    return 'No tengo una recomendación perfecta para eso, pero te sugiero echar un vistazo a la página de Explora para descubrir todos los rincones de Sevilla. También puedes preguntarme por categorías concretas: gastronomía, cultura, naturaleza, comercios o rutas a pie.';
  }

  const hasZone = zones.length > 0;
  const zoneNames = zones.map(z => {
    const zone = zones.find(zz => zz === z);
    const zdata = zones.find(zz => zz === z);
    return z;
  });

  if (intents.length === 0 && !hasZone) {
    intro = 'Esto es lo que he encontrado en Sevilla a partir de tu consulta:';
  } else {
    const intentLabels: Record<string, string> = {
      comer: 'gastronomía',
      cultura: 'cultura',
      naturaleza: 'naturaleza',
      compras: 'comercios locales',
      barrio: 'vida de barrio',
      ruta: 'rutas a pie',
      experiencia: 'experiencias',
      familias: 'planes con niños',
      economico: 'opciones asequibles',
      pareja: 'planes en pareja',
      noche: 'planes de noche',
      lluvia: 'planes para días de lluvia',
      fotografia: 'lugares fotogénicos',
    };
    const labels = intents.map(i => intentLabels[i]).filter(Boolean);
    let context = '';
    if (labels.length > 0) {
      context = labels.join(', ');
    }
    if (hasZone) {
      const zoneData = zones.map(z => {
        const found = Object.entries(zoneKeywords).find(([id]) => id === z);
        return found ? found[0] : '';
      });
      const zoneDisplay = zones.map(z => z.charAt(0).toUpperCase() + z.slice(1)).join(', ');
      context = context ? `${context} en ${zoneDisplay}` : `en ${zoneDisplay}`;
    }
    intro = context
      ? `He buscado entre los lugares, rutas y experiencias de Sevilla relacionados con ${context}. Aquí tienes lo mejor:`
      : 'Esto es lo que he encontrado:';
  }

  return intro;
}

export function processQuery(query: string): AssistantResponse {
  const recs = buildRecommendations(query);
  const text = buildText(query, recs);
  return { text, recommendations: recs };
}

export const suggestionChips = [
  '¿Dónde puedo comer tapeo auténtico?',
  'Un plan para ir con niños',
  'Rutas a pie por Triana',
  'Algo gratuito en el centro',
  'Un atardecer romántico',
  'Mercados de barrio',
  'Comercios artesanos',
  'Lugares para fotografiar',
];

export const welcomeText = '¡Hola! Soy el asistente de ComoEnCasa. Dime qué tipo de plan buscas en Sevilla —gastronomía, cultura, un paseo, algo para niños, un rincón secreto— y te recomendaré lugares, rutas y experiencias que no salen en las guías. ¿Qué te apetece?';
