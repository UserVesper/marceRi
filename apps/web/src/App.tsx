import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// ==========================================
// MOCK DATA: Projetos de Marcenaria Artesanal
// ==========================================
interface ProjetoItem {
  id: string;
  titulo: string;
  categoria: "mesas" | "aparadores" | "poltronas" | "autorais";
  categoriaNome: string;
  ano: number;
  madeiraPrincipal: string;
  acabamento: string;
  dimensoes: string;
  descricaoCurta: string;
  descricaoCompleta: string;
  imagemCapa: string;
  fotosAdicionais: string[];
  destaque?: boolean;
}

const PROJETOS_MOCK: ProjetoItem[] = [
  {
    id: "mesa-cumaru-organica",
    titulo: "Mesa de Jantar Cumaru Raiz",
    categoria: "mesas",
    categoriaNome: "Mesas de Jantar",
    ano: 2026,
    madeiraPrincipal: "Cumaru Maciço Certificado",
    acabamento: "Óleo Mineral Puro e Cera de Abelha",
    dimensoes: "280 x 110 x 76 cm (10 lugares)",
    descricaoCurta: "Prancha única com bordas orgânicas preservadas e encaixes tradicionais tipo gravata borboleta.",
    descricaoCompleta: "Confeccionada a partir de uma única prancha de Cumaru com secagem natural controlada de 2 anos. As fendas naturais foram estabilizadas com marchetaria em gravatas de Roxinho maciço. Pés escultóricos com encaixe respigado manual, sem ferragens aparentes.",
    imagemCapa: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80",
    fotosAdicionais: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80"
    ],
    destaque: true
  },
  {
    id: "aparador-ripado-freijo",
    titulo: "Aparador Brisa em Freijó",
    categoria: "aparadores",
    categoriaNome: "Aparadores & Racks",
    ano: 2025,
    madeiraPrincipal: "Freijó Natural & Palhinha Indiana",
    acabamento: "Seladora Fosca de Baixo Impacto",
    dimensoes: "200 x 48 x 78 cm",
    descricaoCurta: "Frentes com ripas chanfradas e portas corrediças tramadas em palha natural sextavada.",
    descricaoCompleta: "Inspirado no modernismo brasileiro da década de 60. Estrutura em Freijó com puxadores escavados na própria madeira. O fechamento em palhinha indiana garante ventilação para equipamentos e confere leveza visual única.",
    imagemCapa: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
    fotosAdicionais: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80"
    ],
    destaque: true
  },
  {
    id: "poltrona-sol-nogueira",
    titulo: "Poltrona Enseada em Nogueira",
    categoria: "poltronas",
    categoriaNome: "Cadeiras & Poltronas",
    ano: 2025,
    madeiraPrincipal: "Nogueira e Couro Sola Bovino",
    acabamento: "Polimento Manual com Óleo de Tungue",
    dimensoes: "82 x 78 x 72 cm",
    descricaoCurta: "Estrutura torneada artesanalmente com encaixes meia-madeira e assento suspenso em soleta pesponto.",
    descricaoCompleta: "Cada curva desta poltrona é esculpida à goiva e grosa manual até atingir a ergonomia ideal de descanso. O couro sola natural recebe tratamento vegetal e envelhece ganhando pátina nobre ao longo das décadas.",
    imagemCapa: "https://images.unsplash.com/photo-1580481077114-1e0952d73f4e?auto=format&fit=crop&w=1200&q=80",
    fotosAdicionais: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80"
    ],
    destaque: true
  },
  {
    id: "rack-suspenso-carvalho",
    titulo: "Rack Flutuante Carvalho Real",
    categoria: "aparadores",
    categoriaNome: "Aparadores & Racks",
    ano: 2026,
    madeiraPrincipal: "Carvalho Americano Maciço",
    acabamento: "Verniz Poliuretano Acetinado",
    dimensoes: "240 x 42 x 45 cm",
    descricaoCurta: "Fixação oculta por cunha francesa com gavetas em encaixe rabo-de-andorinha inglês.",
    descricaoCompleta: "Desenhado para suportar televisores de grande porte mantendo a sensação de suspensão leve. As gavetas internas utilizam corrediças ocultas com toque amortecido, combinando precisão moderna e marcenaria artesanal.",
    imagemCapa: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80",
    fotosAdicionais: [],
    destaque: false
  },
  {
    id: "mesa-centro-peroba",
    titulo: "Mesa de Centro Tora Demolição",
    categoria: "autorais",
    categoriaNome: "Peças de Autor",
    ano: 2024,
    madeiraPrincipal: "Peroba Rosa Centenária Recuperada",
    acabamento: "Cera Orgânica com Extrato de Própolis",
    dimensoes: "130 x 85 x 38 cm",
    descricaoCurta: "Vigas resgatadas de antigo casarão cafeeiro com marcas históricas de serra fita preservadas.",
    descricaoCompleta: "Mais que um móvel, um fragmento de história preservado. As marcas do tempo, furos de pregos antigos e marcas de oxidação foram respeitados e vitrificados para manter a textura original e toque sedoso.",
    imagemCapa: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=1200&q=80",
    fotosAdicionais: [],
    destaque: false
  },
  {
    id: "banco-torneado-tauari",
    titulo: "Banco Escultórico Tauari",
    categoria: "poltronas",
    categoriaNome: "Cadeiras & Poltronas",
    ano: 2025,
    madeiraPrincipal: "Tauari Claro Selecionado",
    acabamento: "Óleo Escandinavo Natural",
    dimensoes: "150 x 38 x 46 cm",
    descricaoCurta: "Assento côncavo anatômico esculpido à mão em bloco contínuo.",
    descricaoCompleta: "Projetado para halls de entrada, pés de cama e salas de estar acolhedoras. A curvatura do assento foi desenvolvida após estudos ergonômicos minuciosos para dispensar estofamentos.",
    imagemCapa: "https://images.unsplash.com/photo-1506898667547-42e22a46e125?auto=format&fit=crop&w=1200&q=80",
    fotosAdicionais: [],
    destaque: false
  }
];

const MADEIRAS_INFO = [
  {
    nome: "Freijó Brasileiro",
    tom: "Dourado Mel",
    origem: "Norte e Centro-Oeste",
    caracteristica: "Veios lineares marcantes, textura suave e estabilidade dimensional incomparável.",
    foto: "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=600&q=80"
  },
  {
    nome: "Cumaru Maciço",
    tom: "Castanho Avermelhado",
    origem: "Manejo Florestal Sustentável",
    caracteristica: "Densidade altíssima, resistência lendária contra riscos e brilho natural acetinado.",
    foto: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=600&q=80"
  },
  {
    nome: "Nogueira Nobre",
    tom: "Pardo Escuro Aveludado",
    origem: "Florestas Temperadas Certificadas",
    caracteristica: "A rainha da marcenaria fina mundial. Desenhos orgânicos exuberantes e toque macio.",
    foto: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80"
  },
  {
    nome: "Peroba Rosa Demolição",
    tom: "Caramelo Rústico Envelhecido",
    origem: "Casarões e Fazendas Históricas",
    caracteristica: "Madeira imune a pragas, com textura marcada por mais de um século de história viva.",
    foto: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
  }
];

export default function App() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("todas");
  const [projetoSelecionado, setProjetoSelecionado] = useState<ProjetoItem | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);
  const [formEnviado, setFormEnviado] = useState(false);

  // Form State
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoMovel, setTipoMovel] = useState("Mesa de Jantar");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const projetosFiltrados = PROJETOS_MOCK.filter((p) =>
    categoriaAtiva === "todas" ? true : p.categoria === categoriaAtiva
  );

  const handleEnviarOrcamento = (e: React.FormEvent) => {
    e.preventDefault();
    setFormEnviado(true);
  };

  const handleWhatsAppDireto = () => {
    const texto = encodeURIComponent(
      `Olá! Estive vendo o portfólio no site e gostaria de conversar sobre um projeto sob medida de ${tipoMovel}.`
    );
    window.open(`https://wa.me/5511999999999?text=${texto}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#110f0d] text-[#f5f1eb] font-sans selection:bg-amber-600 selection:text-white">
      {/* ============================================================ */}
      {/* 1. NAVBAR COM SCROLL EFFECT & BLUR                           */}
      {/* ============================================================ */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#110f0d]/90 backdrop-blur-md border-b border-stone-800/80 py-3.5 shadow-xl"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#inicio" className="group flex items-center gap-2.5 focus:outline-none">
            <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">🪵</span>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors">
                marce<span className="text-amber-500">RI</span>
              </span>
              <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-stone-400">
                Ateliê de Madeira Maciça
              </span>
            </div>
          </a>

          {/* Links Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#portfolio" className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors">
              Trabalhos
            </a>
            <a href="#atelie" className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors">
              O Ateliê
            </a>
            <a href="#madeiras" className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors">
              Madeiras
            </a>
            <a href="#depoimentos" className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors">
              Clientes
            </a>
            <a
              href="#orcamento"
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
            >
              Pedir Orçamento
            </a>
          </nav>

          {/* Botão Mobile */}
          <button
            onClick={() => setMenuMobile(!menuMobile)}
            className="md:hidden p-2 text-stone-300 hover:text-stone-100 focus:outline-none"
            aria-label="Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 w-full bg-current transform transition-transform ${menuMobile ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`h-0.5 w-full bg-current transition-opacity ${menuMobile ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-full bg-current transform transition-transform ${menuMobile ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* Menu Mobile Drawer */}
        <AnimatePresence>
          {menuMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#161412] border-b border-stone-800 px-6 py-6"
            >
              <div className="flex flex-col gap-4 text-base font-serif">
                <a onClick={() => setMenuMobile(false)} href="#portfolio" className="text-stone-300 hover:text-amber-400 py-1">
                  Trabalhos Selecionados
                </a>
                <a onClick={() => setMenuMobile(false)} href="#atelie" className="text-stone-300 hover:text-amber-400 py-1">
                  O Ateliê &amp; Ofício
                </a>
                <a onClick={() => setMenuMobile(false)} href="#madeiras" className="text-stone-300 hover:text-amber-400 py-1">
                  Mostruário de Madeiras
                </a>
                <a onClick={() => setMenuMobile(false)} href="#orcamento" className="text-amber-400 font-sans font-bold py-2">
                  Solicitar Orçamento &rarr;
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION COM TEXTURA E FOTO IMPACTANTE                */}
      {/* ============================================================ */}
      <section id="inicio" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-6 overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Texto Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/25">
              <span>🪵 Marcenaria Artesanal Sob Medida</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-50 leading-[1.12] tracking-tight">
              Móveis que contam histórias. Feitos à mão para{" "}
              <span className="italic font-normal text-amber-400 underline decoration-amber-500/30 decoration-wavy">
                atravessar gerações.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed font-light">
              Madeiras maciças selecionadas em secagem natural, encaixes tradicionais
              sem ferragens aparentes e acabamentos que preservam a respiração e o perfume orgânico da tora.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#portfolio"
                className="px-7 py-3.5 text-center text-sm font-semibold rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/20 active:scale-95"
              >
                Conhecer Trabalhos
              </a>
              <button
                onClick={handleWhatsAppDireto}
                className="px-7 py-3.5 text-center text-sm font-semibold rounded-full bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <span className="text-emerald-400 text-base">●</span>
                Conversar no WhatsApp
              </button>
            </div>

            {/* Selos de Confiança */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-stone-800/80">
              <div>
                <span className="block text-xl font-bold font-serif text-stone-100">100%</span>
                <span className="text-xs text-stone-400">Madeira Maciça</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-serif text-stone-100">Zero</span>
                <span className="text-xs text-stone-400">Aglomerado / MDF</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-serif text-stone-100">Autoral</span>
                <span className="text-xs text-stone-400">Desenho Exclusivo</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-serif text-stone-100">Vitalícia</span>
                <span className="text-xs text-stone-400">Garantia Estrutural</span>
              </div>
            </div>
          </motion.div>

          {/* Imagem Hero em Destaque */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-900 group">
              <img
                src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80"
                alt="Marcenaria de precisão com encaixes tradicionais"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#110f0d] via-transparent to-transparent opacity-80" />

              {/* Tag flutuante com informações da peça */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#161412]/90 backdrop-blur-md border border-stone-700/60 shadow-lg">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-0.5">
                  Destaque do Ateliê
                </span>
                <p className="font-serif font-bold text-stone-100 text-base">
                  Mesa de Jantar em Prancha Inteiriça
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Encaixes respigados manuais &middot; Acabamento em cera natural
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. PORTFÓLIO COM FILTROS ANIMADOS & MODAL DE DETALHES        */}
      {/* ============================================================ */}
      <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto border-t border-stone-900">
        <div className="max-w-2xl mb-12">
          <span className="text-amber-500 font-mono text-xs uppercase tracking-widest block mb-2">
            Portfólio de Trabalhos
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
            Criações em Destaque
          </h2>
          <p className="text-stone-400 mt-2 text-sm sm:text-base leading-relaxed">
            Clique em qualquer peça para examinar detalhes dos encaixes, medidas e especificações da madeira.
          </p>
        </div>

        {/* Pílulas de Filtro com Layout Spring Animation */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {[
            { id: "todas", label: "Todas as Peças" },
            { id: "mesas", label: "Mesas de Jantar" },
            { id: "aparadores", label: "Aparadores & Racks" },
            { id: "poltronas", label: "Cadeiras & Poltronas" },
            { id: "autorais", label: "Peças de Autor" }
          ].map((cat) => {
            const ativa = categoriaAtiva === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`relative px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 ${
                  ativa ? "text-stone-950 font-semibold" : "text-stone-400 hover:text-stone-200"
                }`}
              >
                {ativa && (
                  <motion.div
                    layoutId="pill-active-bg"
                    className="absolute inset-0 bg-amber-500 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grade de Projetos com Reorganização Dinâmica */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {projetosFiltrados.map((projeto) => (
              <motion.article
                key={projeto.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => setProjetoSelecionado(projeto)}
                className="group cursor-pointer bg-stone-900/40 rounded-2xl overflow-hidden border border-stone-800/80 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black"
              >
                {/* Imagem do Card */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-950">
                  <img
                    src={projeto.imagemCapa}
                    alt={projeto.titulo}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <span className="absolute top-3.5 right-3.5 text-[11px] font-mono bg-stone-950/80 backdrop-blur px-2.5 py-1 rounded-md text-amber-400 border border-stone-700/60">
                    {projeto.ano}
                  </span>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-semibold block mb-1">
                    {projeto.categoriaNome}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
                    {projeto.titulo}
                  </h3>
                  <p className="text-stone-400 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                    {projeto.descricaoCurta}
                  </p>

                  <div className="mt-4 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                    <span className="truncate max-w-[200px] text-stone-300 font-medium">
                      {projeto.madeiraPrincipal}
                    </span>
                    <span className="text-amber-500 font-medium group-hover:translate-x-1 transition-transform">
                      Ver detalhes &rarr;
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 4. MODAL / LIGHTBOX DE DETALHE DO PROJETO                   */}
      {/* ============================================================ */}
      <AnimatePresence>
        {projetoSelecionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setProjetoSelecionado(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#181614] border border-stone-700/80 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Botão Fechar */}
              <button
                onClick={() => setProjetoSelecionado(null)}
                className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-stone-900/80 text-stone-300 hover:text-white flex items-center justify-center border border-stone-700 transition-colors"
                aria-label="Fechar"
              >
                ✕
              </button>

              {/* Foto Principal */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950 rounded-t-3xl">
                <img
                  src={projetoSelecionado.imagemCapa}
                  alt={projetoSelecionado.titulo}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Informações Completas */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
                    {projetoSelecionado.categoriaNome} &middot; Ano {projetoSelecionado.ano}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                    {projetoSelecionado.titulo}
                  </h3>
                </div>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  {projetoSelecionado.descricaoCompleta}
                </p>

                {/* Grid de Especificações Técnicas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
                  <div>
                    <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block">
                      Madeira Empregada
                    </span>
                    <span className="text-sm font-semibold text-stone-200 mt-1 block">
                      {projetoSelecionado.madeiraPrincipal}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block">
                      Dimensões
                    </span>
                    <span className="text-sm font-semibold text-stone-200 mt-1 block">
                      {projetoSelecionado.dimensoes}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block">
                      Acabamento
                    </span>
                    <span className="text-sm font-semibold text-stone-200 mt-1 block">
                      {projetoSelecionado.acabamento}
                    </span>
                  </div>
                </div>

                {/* Ações do Modal */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-800">
                  <span className="text-xs text-stone-400">
                    Peça feita sob encomenda com medidas adaptáveis ao seu ambiente.
                  </span>
                  <button
                    onClick={() => {
                      setTipoMovel(projetoSelecionado.titulo);
                      setProjetoSelecionado(null);
                      const el = document.getElementById("orcamento");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-colors active:scale-95"
                  >
                    Pedir Orçamento Desta Peça &rarr;
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 5. O ATELIÊ & O OFÍCIO (HISTÓRIA E FILOSOFIA)                */}
      {/* ============================================================ */}
      <section id="atelie" className="py-24 px-6 bg-[#161412] border-y border-stone-800/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-stone-700/60 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=80"
                alt="Ferramentas manuais de marcenaria artesanal"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Citação flutuante */}
            <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-[#1d1a17] border border-amber-500/30 max-w-xs shadow-xl hidden sm:block">
              <p className="font-serif italic text-amber-200 text-sm">
                &ldquo;A madeira dita o desenho. O marceneiro apenas revela o que estava guardado na árvore.&rdquo;
              </p>
              <span className="text-xs font-mono text-stone-400 mt-2 block font-normal">
                — Mestre Marceneiro
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-amber-500 font-mono text-xs uppercase tracking-widest block">
              Tradição &amp; Rigor
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
              O Respeito à Matéria-Prima em Cada Encaixe
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              No ateliê marceRI, o tempo corre em outra cadência. Não usamos parafusos aparentes ou cola rápida
              que resseca com as estações do ano. Cada união é executada com encaixes de marcenaria clássica:
              espigas, respigas, cauda-de-andorinha e cavilhas torneadas na própria madeira da peça.
            </p>

            {/* As 4 Etapas do Processo Artesanal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <span className="text-amber-500 font-mono text-xs font-bold block mb-1">
                  01. Seleção da Tora
                </span>
                <p className="text-xs text-stone-400">
                  Escolha manual de pranchas com secagem lenta e veios que valorizam o desenho da peça.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <span className="text-amber-500 font-mono text-xs font-bold block mb-1">
                  02. Encaixes Estruturais
                </span>
                <p className="text-xs text-stone-400">
                  Usinagem e ajuste à mão com formões e plainas manuais japonesas de alta precisão.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <span className="text-amber-500 font-mono text-xs font-bold block mb-1">
                  03. Lixamento Progressivo
                </span>
                <p className="text-xs text-stone-400">
                  Até 8 etapas de grãos finos para alcançar o toque sedoso característico da madeira nobre.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <span className="text-amber-500 font-mono text-xs font-bold block mb-1">
                  04. Acabamento Respirável
                </span>
                <p className="text-xs text-stone-400">
                  Óleos vegetais e ceras naturais atóxicas que protegem contra líquidos sem criar casca plástica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. MOSTRUÁRIO DE MADEIRAS NOBRES                             */}
      {/* ============================================================ */}
      <section id="madeiras" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-amber-500 font-mono text-xs uppercase tracking-widest block mb-2">
            Catálogo de Essências
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
            As Madeiras com que Trabalhamos
          </h2>
          <p className="text-stone-400 mt-2 text-sm sm:text-base">
            Utilizamos exclusivamente madeiras com Documento de Origem Florestal (DOF) ou madeira recuperada de demolição.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MADEIRAS_INFO.map((mad) => (
            <div
              key={mad.nome}
              className="bg-stone-900/50 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/40 transition-colors p-5 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-stone-950">
                  <img src={mad.foto} alt={mad.nome} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-100">{mad.nome}</h3>
                <span className="text-xs font-mono text-amber-400 block mt-0.5">Tonalidade: {mad.tom}</span>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">{mad.caracteristica}</p>
              </div>
              <span className="text-[10px] font-mono text-stone-500 uppercase mt-4 block border-t border-stone-800/80 pt-3">
                Origem: {mad.origem}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. DEPOIMENTOS DE ARQUITETOS E CLIENTES                      */}
      {/* ============================================================ */}
      <section id="depoimentos" className="py-20 px-6 bg-[#161412] border-t border-stone-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-mono text-xs uppercase tracking-widest block mb-2">
              Confiança &amp; Parceria
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-100">
              O que dizem sobre nossas peças
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
              <div className="text-amber-500 text-sm mb-3">★★★★★</div>
              <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
                &ldquo;A mesa de 10 lugares em Cumaru virou a alma do nosso apartamento. A precisão dos encaixes e o toque da madeira são de emocionar.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-stone-800/80">
                <span className="font-serif font-bold text-stone-100 text-sm block">Camila &amp; Roberto S.</span>
                <span className="text-[11px] text-stone-500">Jardins, São Paulo</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
              <div className="text-amber-500 text-sm mb-3">★★★★★</div>
              <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
                &ldquo;Especifico o marceRI em projetos residenciais de alto padrão porque sei que o marceneiro entende de tolerância milimétrica e acabamento nobre.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-stone-800/80">
                <span className="font-serif font-bold text-stone-100 text-sm block">Arq. Marcelo Fonseca</span>
                <span className="text-[11px] text-stone-500">Studio Fonseca Arquitetura</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800">
              <div className="text-amber-500 text-sm mb-3">★★★★★</div>
              <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
                &ldquo;O aparador com palhinha é uma obra de arte viva. Saber que foi feito à mão e que vai durar mais do que nós traz uma paz imensa.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-stone-800/80">
                <span className="font-serif font-bold text-stone-100 text-sm block">Helena Guimarães</span>
                <span className="text-[11px] text-stone-500">Belo Horizonte, MG</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FORMULÁRIO DE ORÇAMENTO & WHATSAPP DIRETO                 */}
      {/* ============================================================ */}
      <section id="orcamento" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-[#181614] border border-stone-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <span className="text-amber-500 font-mono text-xs uppercase tracking-widest block mb-2">
              Inicie seu Projeto
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
              Solicitar Orçamento Sob Medida
            </h2>
            <p className="text-stone-400 mt-2 text-sm leading-relaxed">
              Conte-nos as dimensões aproximadas do seu espaço ou a ideia de móvel que gostaria de construir.
              Retornamos em até 24h com opções de madeiras e estimativas.
            </p>
          </div>

          {formEnviado ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 text-center space-y-3"
            >
              <span className="text-4xl block">🪵</span>
              <h3 className="text-xl font-serif font-bold text-emerald-300">
                Mensagem Recebida com Sucesso!
              </h3>
              <p className="text-sm text-stone-300 max-w-md mx-auto">
                O marceneiro já foi notificado e responderá com as primeiras sugestões de desenho e amostras de madeira.
              </p>
              <button
                onClick={() => setFormEnviado(false)}
                className="mt-4 px-6 py-2 rounded-full text-xs font-semibold bg-emerald-800/50 hover:bg-emerald-800 text-emerald-200 transition-colors"
              >
                Enviar Outro Pedido
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleEnviarOrcamento} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-2">
                    Seu Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Ana Paula Ribeiro"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-2">
                    WhatsApp para Retorno
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-2">
                  Tipo de Móvel Desejado
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {["Mesa de Jantar", "Aparador / Rack", "Cadeira / Banco", "Projeto Especial"].map((tipo) => (
                    <button
                      type="button"
                      key={tipo}
                      onClick={() => setTipoMovel(tipo)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        tipoMovel === tipo
                          ? "bg-amber-500 text-stone-950 border-amber-500 font-bold"
                          : "bg-stone-900/60 text-stone-400 border-stone-800 hover:border-stone-700"
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-2">
                  Detalhes do Projeto &amp; Dimensões Estimadas
                </label>
                <textarea
                  rows={4}
                  required
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Ex: Gostaria de uma mesa de jantar retangular para 8 cadeiras em Freijó, com aproximadamente 2,40m x 1,00m..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-2/3 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
                >
                  Enviar Pedido de Orçamento
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppDireto}
                  className="w-full sm:w-1/3 py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>💬</span> Conversar no WhatsApp
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. BOTÃO FLUTUANTE DE WHATSAPP COM ANIMAÇÃO                  */}
      {/* ============================================================ */}
      <motion.button
        onClick={handleWhatsAppDireto}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2.5 border border-emerald-400/30 group"
        aria-label="Falar no WhatsApp"
      >
        <span className="text-xl">💬</span>
        <span className="hidden sm:inline-block text-xs font-bold pr-1">
          Orçamento WhatsApp
        </span>
      </motion.button>

      {/* ============================================================ */}
      {/* 10. FOOTER ELEGANTE DO ATELIÊ                                */}
      {/* ============================================================ */}
      <footer className="border-t border-stone-800/80 bg-[#0d0c0a] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪵</span>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-stone-100">
                marce<span className="text-amber-500">RI</span>
              </span>
              <p className="text-xs text-stone-500 mt-0.5">
                Ateliê de Marcenaria Artesanal de Precisão &middot; Peças Únicas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
            <span>📍 Ateliê: São Paulo &mdash; SP (Visitas sob agendamento)</span>
            <span>📱 (11) 99999-9999</span>
            <span>✉️ contato@marceri.com.br</span>
          </div>

          <p className="text-[11px] font-mono text-stone-600">
            &copy; {new Date().getFullYear()} marceRI. Feito à mão com madeira e código limpo.
          </p>
        </div>
      </footer>
    </div>
  );
}
