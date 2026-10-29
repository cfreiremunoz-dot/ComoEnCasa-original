// Map library touches `window` on import, so load it only in the browser.
import { lazy, Suspense, useEffect, useState } from "react";
import type { MapViewProps } from "./MapViewInner";

export type { MapMarker, MapViewProps } from "./MapViewInner";

const Inner = lazy(() => import("./MapViewInner").then((m) => ({ default: m.MapView })));

export function MapView(props: MapViewProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const fallback = <div className={`${props.className ?? ""} bg-crema-200`} />;
  if (!ready) return fallback;
  return (
    <Suspense fallback={fallback}>
      <Inner {...props} />
    </Suspense>
  );
}
