import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/views/AboutPage";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre el proyecto · ComoEnCasa" },
      { name: "description", content: "Qué es ComoEnCasa y por qué queremos que vivas Sevilla de otra manera." },
      { property: "og:title", content: "Sobre el proyecto · ComoEnCasa" },
      { property: "og:description", content: "Qué es ComoEnCasa y por qué queremos que vivas Sevilla de otra manera." },
    ],
  }),
  component: AboutPage,
});
