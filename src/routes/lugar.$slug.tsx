import { createFileRoute } from "@tanstack/react-router";
import { PlaceDetailPage } from "@/views/PlaceDetailPage";

export const Route = createFileRoute("/lugar/$slug")({
  head: () => ({
    meta: [
      { title: "Lugar en Sevilla · ComoEnCasa" },
      { name: "description", content: "Ficha de un lugar auténtico de Sevilla con mapa y sitios cercanos." },
      { property: "og:title", content: "Lugar en Sevilla · ComoEnCasa" },
      { property: "og:description", content: "Ficha de un lugar auténtico de Sevilla con mapa y sitios cercanos." },
    ],
  }),
  component: PlaceDetailPage,
});
