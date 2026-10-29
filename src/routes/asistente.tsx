import { createFileRoute } from "@tanstack/react-router";
import { AsistentePage } from "@/views/AsistentePage";

export const Route = createFileRoute("/asistente")({
  head: () => ({
    meta: [
      { title: "Asistente IA · ComoEnCasa" },
      { name: "description", content: "Pregúntale al asistente de ComoEnCasa por planes, lugares y rutas de Sevilla. Recomendaciones personalizadas basadas en la guía local." },
      { property: "og:title", content: "Asistente IA · ComoEnCasa" },
      { property: "og:description", content: "Pregúntale al asistente de ComoEnCasa por planes, lugares y rutas de Sevilla." },
    ],
  }),
  component: AsistentePage,
});
