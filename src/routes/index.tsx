import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/views/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ComoEnCasa · Vive Sevilla, vive ComoEnCasa" },
      { name: "description", content: "Descubre barrios con alma, pequeños comercios, gastronomía cotidiana y rincones de Sevilla que no salen en las guías." },
      { property: "og:title", content: "ComoEnCasa · Vive Sevilla, vive ComoEnCasa" },
      { property: "og:description", content: "Descubre barrios con alma, pequeños comercios, gastronomía cotidiana y rincones de Sevilla que no salen en las guías." },
    ],
  }),
  component: HomePage,
});
