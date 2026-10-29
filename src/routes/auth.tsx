import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/auth')({
  head: () => ({
    meta: [
      { title: 'Acceso al panel · ComoEnCasa' },
      { name: 'description', content: 'Acceso privado para gestionar ComoEnCasa.' },
      { property: 'og:title', content: 'Acceso al panel · ComoEnCasa' },
      { property: 'og:description', content: 'Acceso privado para gestionar ComoEnCasa.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === 'in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error('Correo o contraseña incorrectos');
      navigate({ to: '/admin' });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth` } });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success('Revisa tu correo para confirmar la cuenta y luego entra.');
      setMode('in');
    }
  }

  const field = 'w-full rounded-xl border border-crema-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracota-400';
  return (
    <div className="container-page max-w-md pb-20 pt-32">
      <h1 className="font-serif text-3xl font-semibold text-tinta-800">{mode === 'in' ? 'Entrar al panel' : 'Crear cuenta'}</h1>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <input className={field} type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={field} type="password" placeholder="Contraseña" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={busy} className="rounded-full bg-terracota-500 px-6 py-3 text-sm font-semibold text-white hover:bg-terracota-600 disabled:opacity-60">
          {mode === 'in' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>
      <button onClick={() => setMode(mode === 'in' ? 'up' : 'in')} className="mt-4 text-sm text-terracota-600">
        {mode === 'in' ? '¿Primera vez? Crea tu cuenta' : 'Ya tengo cuenta'}
      </button>
    </div>
  );
}
