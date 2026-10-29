import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoCoords } from '@/hooks/useGeolocation';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  variant?: 'place' | 'user' | 'stop';
}

export interface MapViewProps {
  markers: MapMarker[];
  userCoords?: GeoCoords | null;
  routeLine?: Array<{ lat: number; lng: number }>;
  center?: GeoCoords;
  zoom?: number;
  className?: string;
  fitToMarkers?: boolean;
}

const placeIcon = L.divIcon({
  className: 'comoencasa-map-pin',
  html: '<div class="flex h-7 w-7 items-center justify-center rounded-full bg-terracota-600 text-crema-100 shadow-md ring-2 ring-crema-100"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const stopIcon = L.divIcon({
  className: 'comoencasa-map-pin',
  html: '<div class="flex h-6 w-6 items-center justify-center rounded-full bg-granate-700 text-crema-100 text-[11px] font-bold shadow-md ring-2 ring-crema-100"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const userIcon = L.divIcon({
  className: 'comoencasa-map-user',
  html: '<div class="relative flex h-5 w-5 items-center justify-center"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracota-400/40"></span><span class="relative inline-flex h-3 w-3 rounded-full bg-terracota-500 ring-2 ring-white shadow-md"></span></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function MapView({
  markers,
  userCoords,
  routeLine,
  center = { lat: 37.3886, lng: -5.9845 },
  zoom = 13,
  className = 'h-80 w-full',
  fitToMarkers = true,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      userMarkerRef.current = null;
      routeLineRef.current = null;
    };
  }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    markers.forEach((marker) => {
      const icon = marker.variant === 'stop' ? stopIcon : placeIcon;
      const m = L.marker([marker.lat, marker.lng], { icon });
      if (marker.label) m.bindPopup(marker.label);
      layer.addLayer(m);
      bounds.push([marker.lat, marker.lng]);
    });

    if (userCoords) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      } else {
        userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('Tu ubicación');
      }
      bounds.push([userCoords.lat, userCoords.lng]);
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (routeLine && routeLine.length >= 2) {
      if (routeLineRef.current) {
        routeLineRef.current.setLatLngs(routeLine.map((p) => [p.lat, p.lng] as L.LatLngTuple));
      } else {
        routeLineRef.current = L.polyline(
          routeLine.map((p) => [p.lat, p.lng] as L.LatLngTuple),
          { color: '#a9473d', weight: 3, opacity: 0.7, dashArray: '6 8' },
        ).addTo(map);
      }
      routeLine.forEach((p) => bounds.push([p.lat, p.lng]));
    } else if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (fitToMarkers && bounds.length > 1) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0]!, zoom);
    }
  }, [markers, userCoords, routeLine, fitToMarkers, zoom]);

  return <div ref={containerRef} className={className} aria-label="Mapa interactivo" />;
}
