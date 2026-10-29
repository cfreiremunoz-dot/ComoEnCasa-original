import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RecommendationCard } from '@/components/RecommendationCard';
import { RecommendationForm } from '@/components/RecommendationForm';
import { SITE_TEXT_DEFAULTS, useIsAdmin, useRecommendations, useSiteTexts, type Recommendation, type SiteTextKey } from '@/lib/recommendations';

export const Route = createFileRoute('/_authenticated/admin')({
  head: () => ({
    meta: [
      { title: 'Panel de edición · ComoEnCasa' },
      { name: 'description', content: 'Gestiona recomendaciones y textos de ComoEnCasa.' },
      { property: 'og:title', content: 'Panel de edición · ComoEnCasa' },
      { property: 'og:description', content: 'Gestiona recomendaciones y textos de ComoEnCasa.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: AdminPage,
});

const btn = 'rounded-full px-4 py-1.5 text-xs font-semibold';

function AdminPage() {
  const isAdmin = useIsAdmin();
  const qc = useQueryClient();
  const recs = useRecommendations('all');
  const [editing, setEditing] = useState<Recommendation | 'new' | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ['recommendations'] });

  if (isAdmin.isLoading) return <div className="container-page pt-32">Cargando…</div>;
  if (!isAdmin.data)
    return (
      <div className="container-page pt-32 pb-20">
        <p className="text-tinta-700">Esta cuenta no tiene permiso para editar la web.</p>
        <button className="mt-4 text-sm text-terracota-600" onClick={() => supabase.auth.signOut().then(() => location.assign('/'))}>Salir</button>
      </div>
    );

  async function update(id: string, patch: Partial<Recommendation>) {
    const { error } = await supabase.from('recommendations').update(patch).eq('id', id);
    if (error) return toast.error('No se pudo guardar');
    refresh();
  }
  async function remove(r: Recommendation) {
    if (!confirm(`¿Borrar "${r.name}"?`)) return;
    const { error } = await supabase.from('recommendations').delete().eq('id', r.id);
    if (error) return toast.error('No se pudo borrar');
    if (r.image_url) await supabase.storage.from('recommendation-photos').remove([r.image_url]);
    toast.success('Borrado');
    refresh();
  }

  const pending = recs.data?.filter((r) => r.status === 'pending') ?? [];
  const approved = recs.data?.filter((r) => r.status === 'approved') ?? [];

  return (
    <div className="container-page pb-20 pt-28 sm:pt-32">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-4xl font-semibold text-tinta-800">Panel de edición</h1>
        <div className="flex gap-3">
          <button onClick={() => setEditing('new')} className={`${btn} bg-terracota-500 text-white`}>+ Añadir lugar</button>
          <button onClick={() => supabase.auth.signOut().then(() => location.assign('/'))} className={`${btn} bg-crema-200 text-tinta-700`}>Salir</button>
        </div>
      </div>

      {editing && (
        <section className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-crema-300">
          <div className="mb-4 flex justify-between">
            <h2 className="font-serif text-2xl font-semibold">{editing === 'new' ? 'Nuevo lugar' : `Editar: ${editing.name}`}</h2>
            <button onClick={() => setEditing(null)} className="text-sm text-tinta-500">Cerrar</button>
          </div>
          <RecommendationForm
            key={editing === 'new' ? 'new' : editing.id}
            initial={editing === 'new' ? undefined : editing}
            submitLabel="Guardar"
            onSubmit={async (values) => {
              if (editing === 'new') {
                const { data, error } = await supabase.from('recommendations').insert({ ...values, status: 'pending' }).select('id').single();
                if (error) throw error;
                await supabase.from('recommendations').update({ status: 'approved' }).eq('id', data.id);
              } else {
                const { error } = await supabase.from('recommendations').update(values).eq('id', editing.id);
                if (error) throw error;
              }
              toast.success('Guardado');
              setEditing(null);
              refresh();
            }}
          />
        </section>
      )}

      <HomeTextsEditor />

      <Section title={`Pendientes de revisar (${pending.length})`}>
        {pending.map((r) => (
          <RecommendationCard key={r.id} r={r}>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => update(r.id, { status: 'approved' })} className={`${btn} bg-oliva-500 text-white`}>Publicar</button>
              <button onClick={() => setEditing(r)} className={`${btn} bg-crema-200`}>Editar</button>
              <button onClick={() => remove(r)} className={`${btn} bg-crema-200 text-terracota-700`}>Borrar</button>
            </div>
          </RecommendationCard>
        ))}
      </Section>
      <Section title={`Publicadas (${approved.length})`}>
        {approved.map((r) => (
          <RecommendationCard key={r.id} r={r}>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => setEditing(r)} className={`${btn} bg-crema-200`}>Editar</button>
              <button onClick={() => update(r.id, { status: 'pending' })} className={`${btn} bg-crema-200`}>Ocultar</button>
              <button onClick={() => remove(r)} className={`${btn} bg-crema-200 text-terracota-700`}>Borrar</button>
            </div>
          </RecommendationCard>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-semibold text-tinta-800">{title}</h2>
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

const textLabels: Record<SiteTextKey, string> = {
  hero_title_1: 'Título de portada (primera línea)',
  hero_title_2: 'Título de portada (segunda línea, en color)',
  hero_subtitle: 'Frase bajo el título',
};

function HomeTextsEditor() {
  const texts = useSiteTexts();
  const qc = useQueryClient();
  const [v, setV] = useState<Record<string, string>>(texts);
  useEffect(() => setV(texts), [texts.hero_title_1, texts.hero_title_2, texts.hero_subtitle]);

  async function save() {
    const rows = (Object.keys(SITE_TEXT_DEFAULTS) as SiteTextKey[]).map((key) => ({ key, value: (v[key] ?? '').trim().slice(0, 1000) || SITE_TEXT_DEFAULTS[key], updated_at: new Date().toISOString() }));
    const { error } = await supabase.from('site_texts').upsert(rows);
    if (error) return toast.error('No se pudo guardar');
    toast.success('Textos de portada guardados');
    qc.invalidateQueries({ queryKey: ['site_texts'] });
  }

  return (
    <section className="mt-12 rounded-2xl bg-white p-6 ring-1 ring-crema-300">
      <h2 className="font-serif text-2xl font-semibold text-tinta-800">Textos de la portada</h2>
      <div className="mt-4 grid gap-4">
        {(Object.keys(SITE_TEXT_DEFAULTS) as SiteTextKey[]).map((k) => (
          <label key={k} className="text-sm font-medium text-tinta-700">
            {textLabels[k]}
            <input className="mt-1.5 w-full rounded-xl border border-crema-300 px-4 py-2.5 font-normal" value={v[k] ?? ''} maxLength={200} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      <button onClick={save} className={`${btn} mt-4 bg-terracota-500 text-white`}>Guardar textos</button>
    </section>
  );
}
