import { useCallback, useState } from 'react';

export interface GeoCoords {
  lat: number;
  lng: number;
}

export type GeoStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'unavailable' | 'error';

export interface GeoState {
  status: GeoStatus;
  coords: GeoCoords | null;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    status: 'idle',
    coords: null,
    error: null,
  });

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'unavailable', coords: null, error: 'Tu navegador no permite geolocalización.' });
      return;
    }

    setState({ status: 'loading', coords: null, error: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: 'granted',
          coords: { lat: position.coords.latitude, lng: position.coords.longitude },
          error: null,
        });
      },
      (error) => {
        let message = 'No pudimos obtener tu ubicación.';
        let status: GeoStatus = 'error';

        if (error.code === error.PERMISSION_DENIED) {
          status = 'denied';
          message = 'Has denegado el permiso de ubicación. Puedes activarlo desde los ajustes del navegador y volver a intentarlo.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          status = 'unavailable';
          message = 'Tu ubicación no está disponible en este momento.';
        } else if (error.code === error.TIMEOUT) {
          message = 'Tardó demasiado en obtener tu ubicación. Inténtalo de nuevo.';
        }

        setState({ status, coords: null, error: message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', coords: null, error: null });
  }, []);

  return { ...state, request, reset };
}
