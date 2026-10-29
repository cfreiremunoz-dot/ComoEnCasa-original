import { createFileRoute } from "@tanstack/react-router";
import { ExperienceDetailPage } from "@/views/ExperienceDetailPage";

export const Route = createFileRoute("/experiencias/$slug")({
  head: () => ({
    meta: [
      { title: "Experiencia · ComoEnCasa" },
      { name: "description", content: "Detalles de una experiencia local en Sevilla." },
      { property: "og:title", content: "Experiencia · ComoEnCasa" },
      { property: "og:description", content: "Detalles de una experiencia local en Sevilla." },
    ],
  }),
  component: ExperienceDetailPage,
});
