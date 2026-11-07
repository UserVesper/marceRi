import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type HealthCheckResponse, HealthCheckResponseSchema } from "@marceri/shared";

export default function App() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3333/api/health");
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      const rawData = await response.json();
      const parsed = HealthCheckResponseSchema.parse(rawData);
      setHealth(parsed);
      setLastChecked(new Date());
    } catch (err: unknown) {
      console.error("Falha ao comunicar com a API:", err);
      const msg = err instanceof Error ? err.message : "Não foi possível conectar ao servidor.";
      setError(msg);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#12100e] text-[#f4efe8] flex flex-col justify-between selection:bg-amber-600 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(217,119,6,0.12),transparent_50%)]" />

      {/* Header Minimalista */}
      <header className="relative z-10 border-b border-stone-800/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪵</span>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-stone-100">
                marce<span className="text-amber-500">RI</span>
              </span>
              <span className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded">
                Semana 1 &middot; Fundação
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={checkBackendHealth}
              disabled={loading}
              className="px-3.5 py-1.5 text-xs font-mono rounded-lg border border-stone-700/80 bg-stone-900/60 hover:bg-stone-800 text-stone-300 hover:text-white transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <span className={`inline-block w-2 h-2 rounded-full ${loading ? "bg-amber-500 animate-spin" : "bg-emerald-500"}`} />
              {loading ? "Verificando..." : "Testar Conexão"}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 w-full my-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 mb-6"
          >
            <span>✨ Monorepo Fullstack Integrado</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-50 tracking-tight leading-[1.15]">
            Mobiliário de Autor, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              Engenharia Limpa.
            </span>
          </h1>

          <p className="mt-4 text-stone-400 text-sm sm:text-base leading-relaxed">
            Ambiente da Semana 1 concluído com sucesso. O frontend React 19 consome
            contratos do pacote compartilhado e valida a saúde do backend em Express 5.
          </p>
        </motion.div>

        {/* Card de Status do Sistema */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-stone-900/70 border border-stone-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800/60">
            <div>
              <span className="text-xs font-mono text-stone-400 uppercase tracking-widest block mb-1">
                Conexão Borda a Borda
              </span>
              <h2 className="text-xl font-serif font-bold text-stone-100">
                Status da Infraestrutura
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    Consultando API...
                  </motion.div>
                ) : health ? (
                  <motion.div
                    key="online"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Sistema Online (200 OK)
                  </motion.div>
                ) : (
                  <motion.div
                    key="offline"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Offline / Desconectado
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Grid de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="bg-stone-950/60 border border-stone-800/60 p-4 rounded-xl">
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block mb-1">
                Serviço API
              </span>
              <span className="text-base font-semibold text-stone-200">
                Express 5.0 (Node)
              </span>
              <span className="text-xs font-mono text-stone-400 block mt-1">
                Porta :3333
              </span>
            </div>

            <div className="bg-stone-950/60 border border-stone-800/60 p-4 rounded-xl">
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block mb-1">
                Ambiente
              </span>
              <span className="text-base font-semibold text-amber-400 font-mono">
                {health?.environment ?? "desconhecido"}
              </span>
              <span className="text-xs font-mono text-stone-400 block mt-1">
                v{health?.version ?? "0.1.0"}
              </span>
            </div>

            <div className="bg-stone-950/60 border border-stone-800/60 p-4 rounded-xl">
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block mb-1">
                Banco de Dados
              </span>
              <span className="text-base font-semibold text-stone-200">
                PostgreSQL 16
              </span>
              <span className="text-xs font-mono text-stone-400 block mt-1">
                Docker Compose
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs font-mono">
              ⚠️ {error} &mdash; certifique-se de que a API está rodando via `pnpm dev:api`.
            </div>
          )}

          {lastChecked && (
            <div className="mt-6 text-right">
              <span className="text-[11px] font-mono text-stone-500">
                Última checagem: {lastChecked.toLocaleTimeString()}
              </span>
            </div>
          )}
        </motion.div>

        {/* Seção das Próximas Etapas (Roadmap Preview) */}
        <div className="mt-12">
          <h3 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-4 text-center">
            Próximos Marcos do Projeto
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/60">
              <span className="text-amber-500 font-mono text-xs font-semibold block mb-1">
                Semana 2
              </span>
              <h4 className="text-stone-200 font-medium text-sm">
                Domínio Puro &amp; CLI
              </h4>
              <p className="text-stone-400 text-xs mt-1">
                Value Objects (`Slug`, `Imagem`), entidades e casos de uso testados no terminal.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/60">
              <span className="text-amber-500 font-mono text-xs font-semibold block mb-1">
                Semana 3
              </span>
              <h4 className="text-stone-200 font-medium text-sm">
                Persistência &amp; Imagens
              </h4>
              <p className="text-stone-400 text-xs mt-1">
                Drizzle ORM conectado ao Postgres e conversão de fotos em WebP via Sharp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/60">
              <span className="text-amber-500 font-mono text-xs font-semibold block mb-1">
                Semana 4 &ndash; 7
              </span>
              <h4 className="text-stone-200 font-medium text-sm">
                Frontend &amp; Animações
              </h4>
              <p className="text-stone-400 text-xs mt-1">
                Filtros animados, galeria com Lightbox responsivo e deploy de produção.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-800/60 py-6 px-6 text-center text-xs text-stone-500 font-mono">
        marceRI &middot; Arquitetura Hexagonal &amp; DDD &middot; React 19 + Tailwind v4 + Express 5
      </footer>
    </div>
  );
}
