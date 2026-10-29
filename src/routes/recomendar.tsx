import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { RecommendationForm } from '@/components/RecommendationForm';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/recomendar')({
  head: () => ({
    meta: [
      { title: 'Recomienda un sitio · ComoEnCasa' },
      { name: 'description', content: 'Comparte tu rincón favorito de Sevilla con la comunidad ComoEnCasa.' },
      { property: 'og:title', content: 'Recomienda un sitio · ComoEnCasa' },
      { property: 'og:description', content: 'Comparte tu rincón favorito de Sevilla con la comunidad ComoEnCasa.' },
    ],
  }),
  component: Page,
});

function Page() {
  const [sent, setSent] = useState(false);
  return (
    <div className="container-page max-w-2xl pb-20 pt-28 sm:pt-32">
      <h1 className="font-serif text-4xl font-semibold text-tinta-800">Recomienda un sitio</h1>
      {sent ? (
        <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-crema-300">
          <p className="text-tinta-700">¡Gracias! Revisaremos tu recomendación y aparecerá pronto en la web.</p>
          <div className="mt-4 flex gap-4 text-sm font-semibold text-terracota-600">
            <button onClick={() => setSent(false)}>Recomendar otro</button>
            <Link to="/recomendaciones">Ver recomendaciones</Link>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-8 mt-2 text-tinta-600">Cuéntanos tu sitio favorito. Lo revisamos antes de publicarlo.</p>
          <RecommendationForm
            submitLabel="Enviar recomendación"
            onSubmit={async (values) => {
              const { error } = await supabase.from('recommendations').insert({ ...values, status: 'pending' });
              if (error) throw error;
              setSent(true);
            }}
          />
        </>
      )}
    </div>
  );
}
