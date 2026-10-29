import { createFileRoute } from "@tanstack/react-router";
import { RoutesPage } from "@/views/RoutesPage";

export const Route = createFileRoute("/rutas/")({
  head: () => ({
    meta: [
      { title: "Rutas locales por Sevilla · ComoEnCasa" },
      { name: "description", content: "Rutas a pie por los barrios de Sevilla, diseñadas para vivir la ciudad como un vecino." },
      { property: "og:title", content: "Rutas locales por Sevilla · ComoEnCasa" },
      { property: "og:description", content: "Rutas a pie por los barrios de Sevilla, diseñadas para vivir la ciudad como un vecino." },
    ],
  }),
  component: RoutesPage,
});
