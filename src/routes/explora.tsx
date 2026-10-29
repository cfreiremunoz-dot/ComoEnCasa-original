import { createFileRoute } from "@tanstack/react-router";
import { ExplorePage } from "@/views/ExplorePage";

export const Route = createFileRoute("/explora")({
  head: () => ({
    meta: [
      { title: "Explora Sevilla · ComoEnCasa" },
      { name: "description", content: "Busca y filtra lugares auténticos de Sevilla: bares, comercios, rincones y planes de barrio." },
      { property: "og:title", content: "Explora Sevilla · ComoEnCasa" },
      { property: "og:description", content: "Busca y filtra lugares auténticos de Sevilla: bares, comercios, rincones y planes de barrio." },
    ],
  }),
  component: ExplorePage,
});
