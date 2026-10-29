import { createFileRoute } from "@tanstack/react-router";
import { RouteDetailPage } from "@/views/RouteDetailPage";

export const Route = createFileRoute("/rutas/$slug")({
  head: () => ({
    meta: [
      { title: "Ruta local · ComoEnCasa" },
      { name: "description", content: "Recorrido con paradas, mapa y consejos para vivir Sevilla como en casa." },
      { property: "og:title", content: "Ruta local · ComoEnCasa" },
      { property: "og:description", content: "Recorrido con paradas, mapa y consejos para vivir Sevilla como en casa." },
    ],
  }),
  component: RouteDetailPage,
});
