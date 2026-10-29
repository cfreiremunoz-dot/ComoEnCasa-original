import { createFileRoute } from "@tanstack/react-router";
import { CommunityPage } from "@/views/CommunityPage";

export const Route = createFileRoute("/comunidad")({
  head: () => ({
    meta: [
      { title: "Comunidad · ComoEnCasa" },
      { name: "description", content: "La comunidad de vecinos y viajeros que viven Sevilla como en casa." },
      { property: "og:title", content: "Comunidad · ComoEnCasa" },
      { property: "og:description", content: "La comunidad de vecinos y viajeros que viven Sevilla como en casa." },
    ],
  }),
  component: CommunityPage,
});
