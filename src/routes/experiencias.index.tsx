import { createFileRoute } from "@tanstack/react-router";
import { ExperiencesPage } from "@/views/ExperiencesPage";

export const Route = createFileRoute("/experiencias/")({
  head: () => ({
    meta: [
      { title: "Experiencias en Sevilla · ComoEnCasa" },
      { name: "description", content: "Experiencias auténticas en Sevilla con gente local." },
      { property: "og:title", content: "Experiencias en Sevilla · ComoEnCasa" },
      { property: "og:description", content: "Experiencias auténticas en Sevilla con gente local." },
    ],
  }),
  component: ExperiencesPage,
});
