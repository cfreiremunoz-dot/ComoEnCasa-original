import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from '@/lib/router-compat';
import { Send, Sparkles, MapPin, Route, Compass, ArrowRight } from 'lucide-react';
import { processQuery, suggestionChips, welcomeText, type AssistantRecommendation } from '@/lib/assistant-engine';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  recommendations?: AssistantRecommendation[];
  pending?: boolean;
}

let messageCounter = 0;
function nextId() { return ++messageCounter; }

function kindIcon(kind: string) {
  if (kind === 'lugar') return MapPin;
  if (kind === 'ruta') return Route;
  return Compass;
}

function RecCard({ rec }: { rec: AssistantRecommendation }) {
  const Icon = kindIcon(rec.kind);
  const kindLabel = rec.kind === 'lugar' ? 'Lugar' : rec.kind === 'ruta' ? 'Ruta' : 'Experiencia';
  return (
    <Link
      to={rec.href}
      className="group flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-tinta-100/60 transition-all hover:ring-terracota-200 hover:shadow-md hover:shadow-tinta-900/5"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        <img src={rec.image} alt={rec.imageAlt} className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-tinta-800/80 text-crema-100">
          <Icon className="h-3 w-3" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-terracota-600">{kindLabel}</p>
        <p className="truncate font-serif text-sm font-semibold text-tinta-800 group-hover:text-terracota-600">{rec.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-tinta-500">{rec.reason}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 self-center text-tinta-300 transition-colors group-hover:text-terracota-500" />
    </Link>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-terracota-500 px-4 py-3 text-sm leading-relaxed text-crema-100">
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex max-w-[92%] gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-granate-800 text-crema-100">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-tinta-700 ring-1 ring-tinta-100/60">
            {msg.pending ? (
              <span className="inline-flex items-center gap-1.5 text-tinta-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-terracota-400" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-terracota-400" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-terracota-400" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 text-xs">Buscando recomendaciones…</span>
              </span>
            ) : (
              msg.text
            )}
          </div>
          {msg.recommendations && msg.recommendations.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {msg.recommendations.map((rec) => (
                <RecCard key={`${rec.kind}-${rec.slug}`} rec={rec} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AsistentePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: nextId(), role: 'assistant', text: welcomeText },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isProcessing) return;

    const userMsg: ChatMessage = { id: nextId(), role: 'user', text: trimmed };
    const pendingMsg: ChatMessage = { id: nextId(), role: 'assistant', text: '', pending: true };
    setMessages(prev => [...prev, userMsg, pendingMsg]);
    setInput('');
    setIsProcessing(true);

    setTimeout(() => {
      const result = processQuery(trimmed);
      setMessages(prev =>
        prev.map(m =>
          m.id === pendingMsg.id
            ? { ...m, text: result.text, recommendations: result.recommendations, pending: false }
            : m
        )
      );
      setIsProcessing(false);
      inputRef.current?.focus();
    }, 900);
  }, [isProcessing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col bg-crema-100 pt-16 sm:pt-20">
      <section className="border-b border-albero-200/70 bg-albero-100/40 px-5 py-8 sm:px-8 sm:py-10">
        <div className="container-page">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-granate-800 text-crema-100">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota-600">Asistente IA</p>
              <h1 className="font-serif text-2xl font-semibold tracking-tight text-tinta-800 sm:text-3xl">
                Tu guía local de Sevilla
              </h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-tinta-600">
            Pregúntame por planes, lugares, rutas o experiencias. Te recomiendo opciones reales de Sevilla basadas en lo que buscas.
          </p>
        </div>
      </section>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
        <div className="container-page max-w-3xl space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {messages.length <= 1 && (
            <div className="pt-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-tinta-400">Sugerencias</p>
              <div className="flex flex-wrap gap-2">
                {suggestionChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="chip chip-inactive hover:chip-active"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-albero-200/70 bg-white px-5 py-4 sm:px-8">
        <div className="container-page max-w-3xl">
          <div className="flex items-center gap-3 rounded-2xl bg-crema-100 p-2 ring-1 ring-albero-200 transition-all focus-within:ring-2 focus-within:ring-terracota-400/30">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="¿Qué te apetece hacer en Sevilla?"
              disabled={isProcessing}
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-tinta-800 placeholder:text-tinta-300 focus:outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isProcessing}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracota-500 text-crema-100 transition-all hover:bg-terracota-600 disabled:opacity-40 disabled:hover:bg-terracota-500 active:scale-95"
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-tinta-300">
            El asistente recomienda lugares, rutas y experiencias de la guía ComoEnCasa
          </p>
        </div>
      </div>
    </div>
  );
}
