import React, { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "motion/react";

// Tipos e modelos de dados

export interface ProjetoItem {
  id: string;
  titulo: string;
  categoria: "mesas" | "aparadores" | "poltronas" | "autorais";
  categoriaNome: string;
  ano: number;
  madeiraPrincipal: string;
  tipoEncaixe: string;
  acabamento: string;
  dimensoes: string;
  tempoProducao: string;
  descricaoCurta: string;
  descricaoCompleta: string;
  imagemCapa: string;
  fotosAdicionais: string[];
  detalheArtesanal: string;
  destaque?: boolean;
}

export interface MadeiraEssencia {
  id: string;
  nome: string;
  nomeCientifico: string;
  tom: string;
  dureza: string;
  densidade: string;
  origem: string;
  caracteristica: string;
  usoIdeal: string;
  foto: string;
}

// Configurações de contato do ateliê
export const CONTATO_ATELIE = {
  telefone: "(11) 94071-0139",
  email: "contato@ferrerlim.com.br",
  cidade: "São Paulo — SP (Visitas sob agendamento prévio)",
  // Converte automaticamente o telefone formatado para os dígitos do WhatsApp:
  get whatsappLink(): string {
    const digitos = this.telefone.replace(/\D/g, "");
    return digitos.startsWith("55") ? digitos : `55${digitos}`;
  }
};

// Dados do ateliê

const PROJETOS_FERRERLIM: ProjetoItem[] = [
  {
    id: "mesa-cumaru-raiz",
    titulo: "Mesa de Jantar Cumaru Raiz",
    categoria: "mesas",
    categoriaNome: "Mesas de Jantar",
    ano: 2026,
    madeiraPrincipal: "Cumaru Maciço Certificado DOF",
    tipoEncaixe: "Gravata Borboleta em Roxinho & Respigado Cego",
    acabamento: "Óleo Mineral Puro e Cera de Abelha Bruta",
    dimensoes: "280 × 110 × 76 cm (10 a 12 lugares)",
    tempoProducao: "6 semanas de marcenaria autoral",
    descricaoCurta: "Prancha única com bordas orgânicas preservadas, marchetaria em gravatas borboleta e pés estruturais respigados à mão.",
    descricaoCompleta: "Confeccionada a partir de uma prancha inteiriça de Cumaru com secagem natural em estufa controlada por 24 meses. As aberturas orgânicas da tora foram estabilizadas com gravatas borboleta executadas em Roxinho maciço, criando um contraste visual nobre. A fixação da base à prancha é feita através de chavetas de expansão que respeitam a respiração natural da madeira ao longo das estações.",
    imagemCapa: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1600&q=85",
    fotosAdicionais: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80"
    ],
    detalheArtesanal: "Encaixe respigado duplo ajustado à grosa manual, dispensando parafusos aparentes.",
    destaque: true
  },
  {
    id: "aparador-brisa-freijo",
    titulo: "Aparador Brisa em Freijó",
    categoria: "aparadores",
    categoriaNome: "Aparadores & Racks",
    ano: 2025,
    madeiraPrincipal: "Freijó Natural & Palhinha Sextavada",
    tipoEncaixe: "Meia-Madeira Chanfrada & Cavilhas Ocultas",
    acabamento: "Seladora Natural Fosca Acetinada",
    dimensoes: "210 × 48 × 78 cm",
    tempoProducao: "4 semanas de marcenaria autoral",
    descricaoCurta: "Frentes com ripas chanfradas à plaina e portas corrediças tramadas em palha natural sextavada sobre trilho de madeira.",
    descricaoCompleta: "Homenagem ao melhor do modernismo brasileiro dos anos 1950 e 1960. O freijó claro recebe tratamento com seladora ecológica de baixo impacto que mantém a tonalidade mel dourada. O fechamento em palhinha indiana sextavada garante a ventilação passiva para equipamentos eletrônicos ou acervos sem comprometer a estética delicada.",
    imagemCapa: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=85",
    fotosAdicionais: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80"
    ],
    detalheArtesanal: "Puxadores escavados na própria tora de Freijó com acabamento aveludado ao toque.",
    destaque: true
  },
  {
    id: "poltrona-enseada-nogueira",
    titulo: "Poltrona Enseada em Nogueira",
    categoria: "poltronas",
    categoriaNome: "Cadeiras & Poltronas",
    ano: 2025,
    madeiraPrincipal: "Nogueira Nobre & Couro Sola Bovino",
    tipoEncaixe: "Encaixes Mortise-and-Tenon Esculpidos",
    acabamento: "Polimento Manual com Óleo de Tungue Puro",
    dimensoes: "84 × 78 × 73 cm",
    tempoProducao: "5 semanas de marcenaria autoral",
    descricaoCurta: "Estrutura curva esculpida à mão em nogueira maciça, com assento anatômico suspenso em couro de curtimento vegetal.",
    descricaoCompleta: "Cada braço e travessa desta poltrona nasce de blocos maciços desbastados manualmente com goivas e plainas japonesas Kanna. O couro soleta legítimo de 3.5mm é costurado com pesponto náutico manual e ganha pátina natural com o uso, moldando-se com perfeição ao corpo com o passar das décadas.",
    imagemCapa: "https://images.unsplash.com/photo-1580481077114-1e0952d73f4e?auto=format&fit=crop&w=1600&q=85",
    fotosAdicionais: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80"
    ],
    detalheArtesanal: "Curvatura ergonômica lombar calculada para conforto prolongado sem necessidade de espuma sintética.",
    destaque: true
  },
  {
    id: "rack-flutuante-carvalho",
    titulo: "Rack Flutuante Carvalho Real",
    categoria: "aparadores",
    categoriaNome: "Aparadores & Racks",
    ano: 2026,
    madeiraPrincipal: "Carvalho Americano Maciço",
    tipoEncaixe: "Cauda-de-Andorinha Manual & Cunha Francesa",
    acabamento: "Cera Microcristalina Atóxica",
    dimensoes: "240 × 44 × 42 cm",
    tempoProducao: "4 semanas de marcenaria autoral",
    descricaoCurta: "Sistema de fixação invisível por cunha francesa com gavetas frontais em junta rabo-de-andorinha aparente.",
    descricaoCompleta: "Projetado para interiores contemporâneos de arquitetura limpa. A estrutura flutuante é ancorada com precisão milimétrica através de barramento chanfrado maciço. As gavetas internas deslizam sobre corrediças ocultas com amortecimento de fechamento suave, unindo a precisão da mecânica moderna ao primor da marcenaria clássica.",
    imagemCapa: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1600&q=85",
    fotosAdicionais: [],
    detalheArtesanal: "Encaixe cauda-de-andorinha com corte de 1:8 executado inteiramente à serra japonesa Dozuki.",
    destaque: false
  },
  {
    id: "mesa-centro-peroba-demolicao",
    titulo: "Mesa de Centro Tora Demolição",
    categoria: "autorais",
    categoriaNome: "Peças de Autor",
    ano: 2024,
    madeiraPrincipal: "Peroba Rosa Centenária Recuperada",
    tipoEncaixe: "Cavilhas de Roxinho e Resina Natural",
    acabamento: "Cera Orgânica com Extrato de Própolis",
    dimensoes: "135 × 85 × 36 cm",
    tempoProducao: "3 semanas de restauração e marcenaria",
    descricaoCurta: "Vigas resgatadas de antigo casarão cafeeiro com marcas históricas de serra fita e pátina de mais de um século preservadas.",
    descricaoCompleta: "Um tributo à arquitetura e à história florestal brasileira. As vigas centenárias são higienizadas, estabilizadas e planificadas sem apagar os orifícios e fendas que testemunham o passado da peça. O toque é sedoso e o aroma sutil de própolis protege as fibras permanentemente.",
    imagemCapa: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=1600&q=85",
    fotosAdicionais: [],
    detalheArtesanal: "Preservação da textura de serra fita original de 1910 contrastada com cantos suavemente bisotados.",
    destaque: false
  },
  {
    id: "banco-anatomico-tauari",
    titulo: "Banco Escultórico Tauari",
    categoria: "poltronas",
    categoriaNome: "Cadeiras & Poltronas",
    ano: 2025,
    madeiraPrincipal: "Tauari Claro Selecionado",
    tipoEncaixe: "Respigado Oculto e Alma Interna de Nogueira",
    acabamento: "Óleo Escandinavo Natural Puro",
    dimensoes: "160 × 40 × 45 cm",
    tempoProducao: "3 semanas de marcenaria autoral",
    descricaoCurta: "Assento côncavo anatômico esculpido à mão em bloco contínuo, proporcionando leveza visual e conforto acústico.",
    descricaoCompleta: "Ideal para halls de entrada, galerias e pés de cama. A curvatura do assento foi desenvolvida após estudos ergonômicos minuciosos para dispensar estofamentos sintéticos, mantendo o usuário conectado diretamente à textura da madeira viva.",
    imagemCapa: "https://images.unsplash.com/photo-1506898667547-42e22a46e125?auto=format&fit=crop&w=1600&q=85",
    fotosAdicionais: [],
    detalheArtesanal: "Concavidade modelada com plaina côncava (Scorp) e lixamento progressivo até grão 1200.",
    destaque: false
  }
];

const MADEIRAS_FERRERLIM: MadeiraEssencia[] = [
  {
    id: "freijo",
    nome: "Freijó Brasileiro",
    nomeCientifico: "Cordia goeldiana",
    tom: "Dourado Mel com Veios Castanhos",
    dureza: "Média (Janka 1.100 lbf)",
    densidade: "650 kg/m³",
    origem: "Manejo Florestal Sustentável (DOF Pará / Mato Grosso)",
    caracteristica: "Veios lineares marcantes, textura suave e estabilidade dimensional incomparável. Excelente resposta a óleos minerais.",
    usoIdeal: "Aparadores, painéis ripados, mesas de centro e mesas de jantar refinadas.",
    foto: "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cumaru",
    nome: "Cumaru Maciço",
    nomeCientifico: "Dipteryx odorata",
    tom: "Castanho Avermelhado Acetinado",
    dureza: "Altíssima (Janka 3.540 lbf)",
    densidade: "1.090 kg/m³",
    origem: "Manejo Florestal Certificado FSC / Ibama",
    caracteristica: "Densidade excepcional, extrema resistência a impactos e umidade. Exala perfume adocicado característico de cumarina.",
    usoIdeal: "Mesas de jantar de grande porte, tampos em prancha inteiriça e bancos estruturais.",
    foto: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "nogueira",
    nome: "Nogueira Nobre",
    nomeCientifico: "Juglans nigra",
    tom: "Pardo Escuro Aveludado com Nuances Chocolate",
    dureza: "Equilibrada (Janka 1.010 lbf)",
    densidade: "640 kg/m³",
    origem: "Florestas Temperadas de Manejo Controlado",
    caracteristica: "A rainha da marcenaria fina internacional. Desenhos de grã exuberantes e toque macio único.",
    usoIdeal: "Poltronas escultóricas, detalhes de marchetaria, escrivaninhas e gaveteiros nobres.",
    foto: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "peroba-rosa",
    nome: "Peroba Rosa Centenária",
    nomeCientifico: "Aspidosperma polyneuron",
    tom: "Caramelo Rústico Envelhecido com Pátina Histórica",
    dureza: "Alta (Janka 1.600 lbf)",
    densidade: "790 kg/m³",
    origem: "Demolição Sustentável (Casarões Históricos SP/PR)",
    caracteristica: "Totalmente imune a pragas devido ao tempo de cura secular. Cada peça carrega marcas históricas e alma irrepetível.",
    usoIdeal: "Mesas rústicas refinadas, aparadores de destaque, estantes e peças de autor.",
    foto: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
  }
];

const DEPOIMENTOS_CLIENTES = [
  {
    autor: "Camila & Roberto Schuller",
    local: "Jardins, São Paulo",
    texto: "A mesa em Cumaru com bordas orgânicas se tornou o ponto central da nossa casa. A perfeição dos encaixes e a sedosidade do acabamento mostram que a Ferrerlim trata a madeira como arte, não como móvel comum.",
    projeto: "Mesa de Jantar Cumaru Raiz"
  },
  {
    autor: "Arq. Marcelo Fonseca",
    local: "Studio Fonseca Arquitetura",
    texto: "Especifico o ateliê Ferrerlim em residências de altíssimo padrão com total tranquilidade. Eles entendem de tolerância milimétrica, estabilidade da madeira e estética apurada. Um nível de acabamento raro no Brasil.",
    projeto: "Aparadores e Racks sob medida"
  },
  {
    autor: "Helena Bittencourt",
    local: "Alto de Pinheiros, São Paulo",
    texto: "A poltrona em Nogueira com couro soleta é uma verdadeira escultura viva. É fascinante ver a ausência de parafusos aparentes e como a ergonomia acolhe sem precisar de almofadas artificiais.",
    projeto: "Poltrona Enseada em Nogueira"
  }
];

// Ícones vetoriais

function LogoFerrerlim({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <rect width="36" height="36" rx="9" fill="#1b1815" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="1.2" />
      {/* Geometria de encaixe rabo-de-andorinha estilizado */}
      <path d="M10 11H26" stroke="#f5f1eb" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 18H21" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 25H17" stroke="#f5f1eb" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="26" cy="25" r="2.2" fill="#d97706" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 10l4 4L16 6" />
    </svg>
  );
}

function IconClose({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

function IconArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

function IconWhatsApp({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function IconRuler({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21.3 8.7L15.3 2.7c-.8-.8-2-.8-2.8 0L2.7 12.5c-.8.8-.8 2 0 2.8l6 6c.8.8 2 .8 2.8 0L21.3 11.5c.8-.8.8-2 0-2.8z" />
      <path d="M6.5 16.5l2-2M9.5 13.5l2-2M12.5 10.5l2-2M15.5 7.5l2-2" />
    </svg>
  );
}

function IconShield({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconCompass({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

// Componente principal

export default function App() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("todas");
  const [projetoSelecionado, setProjetoSelecionado] = useState<ProjetoItem | null>(null);
  const [fotoModalAtiva, setFotoModalAtiva] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);
  const [madeiraDetalhe, setMadeiraDetalhe] = useState<MadeiraEssencia | null>(null);

  // Estados do Simulador de Projeto Sob Medida
  const [simTipo, setSimTipo] = useState<string>("Mesa de Jantar");
  const [simMadeira, setSimMadeira] = useState<string>("Freijó Brasileiro");
  const [simDimensao, setSimDimensao] = useState<string>("240 × 100 cm (8 lugares)");
  const [simAcabamento, setSimAcabamento] = useState<string>("Óleo Acetinado & Cera de Abelha");

  // Estados do Formulário de Contato / Orçamento
  const [formNome, setFormNome] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMensagem, setFormMensagem] = useState("");
  const [formEnviado, setFormEnviado] = useState(false);

  const formId = useId();

  // Scroll detection para o header de vidro fosco
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloqueio de scroll ao abrir modal (Mobile-native e UX refinada)
  useEffect(() => {
    if (projetoSelecionado || madeiraDetalhe || menuMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [projetoSelecionado, madeiraDetalhe, menuMobile]);

  // Fechamento com a tecla Escape (Acessibilidade e Interrupção fluida)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProjetoSelecionado(null);
        setMadeiraDetalhe(null);
        setMenuMobile(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sincroniza foto do modal com a capa ao selecionar projeto
  useEffect(() => {
    if (projetoSelecionado) {
      setFotoModalAtiva(projetoSelecionado.imagemCapa);
    }
  }, [projetoSelecionado]);

  // Filtragem de projetos
  const projetosFiltrados = PROJETOS_FERRERLIM.filter((p) =>
    categoriaAtiva === "todas" ? true : p.categoria === categoriaAtiva
  );

  // Abertura do WhatsApp estruturada
  const handleWhatsApp = (detalhesTexto?: string) => {
    const textoPadrao =
      detalhesTexto ||
      `Olá, Ateliê Ferrerlim! Gostaria de conversar sobre um projeto sob medida de ${simTipo} em ${simMadeira} (${simDimensao}).`;
    const url = `https://wa.me/${CONTATO_ATELIE.whatsappLink}?text=${encodeURIComponent(textoPadrao)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEnviarOrcamento = (e: React.FormEvent) => {
    e.preventDefault();
    setFormEnviado(true);
  };

  const preencherComProjeto = (projeto: ProjetoItem) => {
    setSimTipo(projeto.categoriaNome);
    setSimMadeira(projeto.madeiraPrincipal.split(" ")[0] || "Freijó Brasileiro");
    setSimDimensao(projeto.dimensoes);
    setProjetoSelecionado(null);
    const element = document.getElementById("simulador");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0d0c0a] text-[#f5f1eb] font-sans antialiased selection:bg-amber-600/30 selection:text-amber-200">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-out ${scrolled
            ? "bg-[#0d0c0a]/85 backdrop-blur-xl border-b border-white/[0.07] py-3.5 shadow-2xl shadow-black/40"
            : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Marca / Logotipo com Microinteração */}
          <a
            href="#inicio"
            className="group flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
            aria-label="Ferrerlim Ateliê de Marcenaria Autoral"
          >
            <motion.div
              whileHover={{ rotate: 6 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <LogoFerrerlim className="w-9 h-9" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors duration-200">
                FERRERLIM
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-stone-400 -mt-0.5">
                Ateliê de Madeira Maciça
              </span>
            </div>
          </a>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {[
              { href: "#obras", label: "Obras Autorais" },
              { href: "#oficio", label: "O Ofício" },
              { href: "#madeiras", label: "Essências Nobres" },
              { href: "#simulador", label: "Simulador" },
              { href: "#depoimentos", label: "Clientes" }
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-stone-300 hover:text-amber-400 transition-colors duration-200 font-medium py-1"
              >
                {link.label}
              </a>
            ))}

            <motion.a
              href="#simulador"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-full shadow-lg shadow-amber-500/20 active:shadow-none"
            >
              Orçamento Autoral
            </motion.a>
          </nav>

          {/* Botão Mobile Hamburger (Área de toque de 44x44px) */}
          <button
            onClick={() => setMenuMobile(!menuMobile)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-stone-300 hover:text-white hover:bg-stone-800/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label={menuMobile ? "Fechar navegação" : "Abrir navegação"}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`h-0.5 w-full bg-current transform transition-transform duration-200 ${menuMobile ? "rotate-45 translate-y-1.5" : ""
                  }`}
              />
              <span
                className={`h-0.5 w-full bg-current transition-opacity duration-200 ${menuMobile ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`h-0.5 w-full bg-current transform transition-transform duration-200 ${menuMobile ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Menu Mobile Drawer com AnimatePresence e Gestos Fluidos */}
        <AnimatePresence>
          {menuMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="md:hidden bg-[#110f0d]/95 backdrop-blur-xl border-b border-stone-800/80 px-6 py-6"
            >
              <div className="flex flex-col gap-4 text-base font-serif">
                {[
                  { href: "#obras", label: "Obras Autorais Selecionadas" },
                  { href: "#oficio", label: "O Ofício & Tradição Ferrerlim" },
                  { href: "#madeiras", label: "Mostruário de Essências Nobres" },
                  { href: "#simulador", label: "Simulador de Projeto Sob Medida" },
                  { href: "#depoimentos", label: "Arquitetos & Colecionadores" }
                ].map((item) => (
                  <a
                    key={item.href}
                    onClick={() => setMenuMobile(false)}
                    href={item.href}
                    className="text-stone-300 hover:text-amber-400 py-1 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-3 border-t border-stone-800/80 flex flex-col gap-3">
                  <a
                    onClick={() => setMenuMobile(false)}
                    href="#simulador"
                    className="w-full text-center py-3 rounded-xl bg-amber-500 text-stone-950 font-sans font-bold text-sm tracking-wide"
                  >
                    Iniciar Projeto Sob Medida &rarr;
                  </a>
                  <button
                    onClick={() => {
                      setMenuMobile(false);
                      handleWhatsApp();
                    }}
                    className="w-full py-3 rounded-xl bg-stone-900 border border-stone-700/80 text-emerald-400 font-sans text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <IconWhatsApp className="w-4 h-4" />
                    Atendimento Direto no WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section
        id="inicio"
        className="relative min-h-[94vh] flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden"
      >
        {/* Glow sutil orgânico com blur amplo (sem agressividade visual) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Coluna de Texto & Manifesto */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-7"
          >
            {/* Tag / Badge de Precisão */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/25">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Marcenaria Autoral &bull; Madeira Maciça DOF</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-50 leading-[1.14] tracking-[-0.03em]">
              Móveis que preservam a alma da tora. Feitos para{" "}
              <span className="relative inline-block font-serif italic font-normal">
                <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  atravessar gerações.
                </span>
                <span
                  className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-amber-500/0 via-amber-400/80 to-amber-500/0"
                  aria-hidden="true"
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed font-light">
              No ateliê <strong className="text-stone-100 font-semibold">Ferrerlim</strong>, a madeira dita o traço.
              Trabalhamos com madeiras nobres em secagem natural, marchetaria estrutural clássica e acabamentos
              respiráveis que respeitam o calor e o perfume orgânico da matéria-prima.
            </p>

            {/* CTAs com feedback tátil Apple-style */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <motion.a
                href="#obras"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="px-8 py-4 text-center text-sm font-semibold rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 transition-all duration-200 shadow-xl shadow-amber-500/15"
              >
                Explorar Obras Autorais
              </motion.a>

              <motion.button
                onClick={() => handleWhatsApp()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="px-8 py-4 text-center text-sm font-semibold rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 transition-all duration-200 flex items-center justify-center gap-2.5"
              >
                <IconWhatsApp className="w-4 h-4 text-emerald-400" />
                Conversar com o Marceneiro
              </motion.button>
            </div>

            {/* Selos de Rigor Técnico */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/[0.08]">
              <div>
                <span className="block text-2xl font-bold font-serif text-stone-100">100%</span>
                <span className="text-xs text-stone-400">Madeira Maciça</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-serif text-stone-100">Zero</span>
                <span className="text-xs text-stone-400">MDF ou Aglomerado</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-serif text-stone-100">Vitalícia</span>
                <span className="text-xs text-stone-400">Garantia Estrutural</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-serif text-stone-100">São Paulo</span>
                <span className="text-xs text-stone-400">Ateliê Autoral</span>
              </div>
            </div>
          </motion.div>

          {/* Coluna da Fotografia em Alta Resolução */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl shadow-black/80 group">
              <img
                src="https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=85"
                alt="Mesa de jantar de madeira maciça Ferrerlim com acabamento acetinado"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a] via-transparent to-transparent opacity-75" />

              {/* Tag Flutuante Translúcida */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#161411]/85 backdrop-blur-md border border-white/[0.1] shadow-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                    Obra do Ateliê Ferrerlim
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">2026</span>
                </div>
                <p className="font-serif font-bold text-stone-100 text-base">
                  Mesa de Jantar Cumaru Raiz
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Prancha única &bull; Marchetaria em gravatas de Roxinho &bull; Cera pura
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catálogo de obras autorais */}
      <section id="obras" className="py-28 px-6 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="max-w-2xl mb-12">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-semibold">
            Portfólio de Obras
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 tracking-[-0.02em]">
            Criações Selecionadas do Ateliê
          </h2>
          <p className="text-stone-400 mt-3 text-sm sm:text-base leading-relaxed">
            Cada móvel é numerado e acompanhado de certificado de autenticidade da madeira com Documento de Origem Florestal.
          </p>
        </div>

        {/* Pílulas de Filtro com layoutId e física de molas (Emil Kowalski) */}
        <div className="flex flex-wrap items-center gap-2.5 mb-12">
          {[
            { id: "todas", label: "Todas as Obras" },
            { id: "mesas", label: "Mesas de Jantar" },
            { id: "aparadores", label: "Aparadores & Racks" },
            { id: "poltronas", label: "Cadeiras & Poltronas" },
            { id: "autorais", label: "Peças de Autor" }
          ].map((cat) => {
            const ativa = categoriaAtiva === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id)}
                whileTap={{ scale: 0.96 }}
                className={`relative px-5 py-2.5 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${ativa ? "text-stone-950 font-bold" : "text-stone-400 hover:text-stone-200 hover:bg-stone-900/40"
                  }`}
              >
                {ativa && (
                  <motion.div
                    layoutId="pill-active-bg"
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Grade de Cards com Layout PopLayout e Stagger */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {projetosFiltrados.map((projeto) => (
              <motion.article
                key={projeto.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setProjetoSelecionado(projeto)}
                className="group cursor-pointer bg-[#14120f]/80 rounded-2xl overflow-hidden border border-white/[0.08] hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/70 flex flex-col justify-between"
              >
                {/* Imagem do Card */}
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-950">
                    <img
                      src={projeto.imagemCapa}
                      alt={projeto.titulo}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14120f] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                    <span className="absolute top-3.5 right-3.5 text-[10px] font-mono bg-[#0d0c0a]/85 backdrop-blur-md px-2.5 py-1 rounded-md text-amber-400 border border-white/[0.08]">
                      {projeto.ano}
                    </span>
                  </div>

                  {/* Detalhes do Card */}
                  <div className="p-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold block mb-1.5">
                      {projeto.categoriaNome}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-stone-100 group-hover:text-amber-400 transition-colors duration-200">
                      {projeto.titulo}
                    </h3>
                    <p className="text-stone-400 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                      {projeto.descricaoCurta}
                    </p>
                  </div>
                </div>

                {/* Rodapé do Card com Meta */}
                <div className="px-6 pb-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-stone-400">
                  <span className="truncate max-w-[200px] text-stone-300 font-medium">
                    {projeto.madeiraPrincipal.split("&")[0]}
                  </span>
                  <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                    Examinar <IconArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Modal de detalhes da obra */}
      <AnimatePresence>
        {projetoSelecionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setProjetoSelecionado(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151310] border border-white/[0.12] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Botão Fechar Tátil */}
              <button
                onClick={() => setProjetoSelecionado(null)}
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-[#0d0c0a]/80 backdrop-blur-md text-stone-300 hover:text-white flex items-center justify-center border border-white/[0.1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                aria-label="Fechar detalhes da obra"
              >
                <IconClose className="w-4 h-4" />
              </button>

              {/* Foto Principal em Destaque */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950 rounded-t-3xl">
                <img
                  src={fotoModalAtiva}
                  alt={projetoSelecionado.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151310] via-transparent to-transparent opacity-50" />
              </div>

              {/* Seletor de Miniaturas (Se houver fotos adicionais) */}
              {projetoSelecionado.fotosAdicionais.length > 0 && (
                <div className="flex items-center gap-3 px-6 sm:px-8 pt-4">
                  {[projetoSelecionado.imagemCapa, ...projetoSelecionado.fotosAdicionais].map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFotoModalAtiva(url)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${fotoModalAtiva === url
                          ? "border-amber-400 scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                    >
                      <img src={url} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Conteúdo & Especificações de Marcenaria */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                      {projetoSelecionado.categoriaNome} &bull; Ano {projetoSelecionado.ano}
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                      Ferrerlim #{projetoSelecionado.id}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                    {projetoSelecionado.titulo}
                  </h3>
                </div>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                  {projetoSelecionado.descricaoCompleta}
                </p>

                {/* Grid de Especificações de Atelier */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#1a1714] border border-white/[0.08]">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                      Madeira Empregada
                    </span>
                    <span className="text-sm font-semibold text-stone-100 mt-1 block">
                      {projetoSelecionado.madeiraPrincipal}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                      Dimensões
                    </span>
                    <span className="text-sm font-semibold text-stone-100 mt-1 block">
                      {projetoSelecionado.dimensoes}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                      Acabamento & Cura
                    </span>
                    <span className="text-sm font-semibold text-stone-100 mt-1 block">
                      {projetoSelecionado.acabamento}
                    </span>
                  </div>
                </div>

                {/* Destaque do Ofício */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                  <IconShield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wide text-amber-300 font-semibold block">
                      Encaixe Estrutural Manual
                    </span>
                    <p className="text-xs text-stone-300 mt-0.5">
                      {projetoSelecionado.tipoEncaixe} &mdash; {projetoSelecionado.detalheArtesanal}
                    </p>
                  </div>
                </div>

                {/* Ações do Modal */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
                  <span className="text-xs text-stone-400">
                    Tempo estimado de produção: <strong className="text-stone-200">{projetoSelecionado.tempoProducao}</strong>
                  </span>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <motion.button
                      onClick={() => preencherComProjeto(projetoSelecionado)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Personalizar Esta Peça
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* O ofício e tradição */}
      <section id="oficio" className="py-28 px-6 bg-[#12100d] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Fotografia do Ateliê com Detalhes Manuais */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=80"
                alt="Ferramentas tradicionais de marcenaria de alta precisão no ateliê Ferrerlim"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Citação Flutuante do Marceneiro */}
            <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-[#1b1814] border border-amber-500/30 max-w-xs shadow-2xl hidden sm:block">
              <p className="font-serif italic text-amber-200/90 text-sm leading-relaxed">
                &ldquo;A madeira nos ensina paciência. O marceneiro apenas ouve os veios da árvore e retira o excesso.&rdquo;
              </p>
              <span className="text-xs font-mono text-stone-400 mt-2 block font-normal">
                &mdash; Rodrigo Ferrerlim, Ateliê
              </span>
            </div>
          </div>

          {/* Os 4 Pilares da Marcenaria de Precisão */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block font-semibold">
              Tradição, Física &amp; Rigor
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 tracking-[-0.02em]">
              O Respeito à Fibra da Madeira em Cada Encaixe
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              No ateliê <strong className="text-stone-100 font-semibold">Ferrerlim</strong>, não aceleramos o tempo com secagens forçadas que estressam a fibra nem mascaramos defeitos com massa sintética. Cada móvel é desenhado considerando o coeficiente de dilatação higrométrica da espécie e construído com técnicas que mantêm a integridade por mais de um século.
            </p>

            {/* As 4 Etapas do Método Autoral */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-[#171411] border border-white/[0.08]">
                <span className="text-amber-400 font-mono text-xs font-bold block mb-1">
                  01. Seleção &amp; Cura Natural
                </span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Pranchas com certificação florestal repousam em estufa natural até atingirem 10-12% de umidade interna ideal.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#171411] border border-white/[0.08]">
                <span className="text-amber-400 font-mono text-xs font-bold block mb-1">
                  02. Encaixes Sem Ferragens
                </span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Espigas, respigas, gravatas borboleta e cauda-de-andorinha ajustadas à serra Dozuki e formões manuais.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#171411] border border-white/[0.08]">
                <span className="text-amber-400 font-mono text-xs font-bold block mb-1">
                  03. Lixamento Progressivo
                </span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Até 8 etapas de grãos finos à mão com desfibramento hídrico para atingir toque sedoso permanente.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#171411] border border-white/[0.08]">
                <span className="text-amber-400 font-mono text-xs font-bold block mb-1">
                  04. Acabamento Orgânico Puro
                </span>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Óleos vegetais de tungue e linhaça combinados a cera de abelha pura. Sem vernizes plásticos sintéticos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo de essências nobres */}
      <section id="madeiras" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-semibold">
            Matéria-Prima com Certificação
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 tracking-[-0.02em]">
            As Essências Nobres do Ateliê Ferrerlim
          </h2>
          <p className="text-stone-400 mt-3 text-sm sm:text-base leading-relaxed">
            Todas as madeiras utilizadas possuem Documento de Origem Florestal (DOF / Ibama) ou provêm de desmontes históricos recuperados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MADEIRAS_FERRERLIM.map((mad) => (
            <motion.div
              key={mad.id}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => setMadeiraDetalhe(mad)}
              className="group cursor-pointer bg-[#14120f]/80 rounded-2xl overflow-hidden border border-white/[0.08] hover:border-amber-500/40 transition-colors p-5 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-stone-950">
                  <img
                    src={mad.foto}
                    alt={mad.nome}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-lg text-stone-100 group-hover:text-amber-400 transition-colors">
                    {mad.nome}
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400">
                    {mad.densidade}
                  </span>
                </div>
                <span className="text-xs font-mono text-stone-400 italic block">
                  {mad.nomeCientifico}
                </span>
                <p className="text-xs text-stone-300 mt-2.5 leading-relaxed line-clamp-3">
                  {mad.caracteristica}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] mt-4 flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400 uppercase">
                  Dureza: {mad.dureza.split("(")[0]}
                </span>
                <span className="text-xs text-amber-400 font-medium">Ver detalhes &rarr;</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal de Detalhe da Madeira */}
      <AnimatePresence>
        {madeiraDetalhe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setMadeiraDetalhe(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#171411] border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setMadeiraDetalhe(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-900/80 text-stone-300 hover:text-white flex items-center justify-center border border-white/[0.1]"
                aria-label="Fechar"
              >
                <IconClose className="w-4 h-4" />
              </button>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-950">
                <img src={madeiraDetalhe.foto} alt={madeiraDetalhe.nome} className="w-full h-full object-cover" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  {madeiraDetalhe.nomeCientifico}
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-100">
                  {madeiraDetalhe.nome}
                </h3>
              </div>

              <div className="space-y-3 text-xs text-stone-300">
                <p><strong className="text-stone-100">Tonalidade:</strong> {madeiraDetalhe.tom}</p>
                <p><strong className="text-stone-100">Dureza Janka:</strong> {madeiraDetalhe.dureza}</p>
                <p><strong className="text-stone-100">Densidade Específica:</strong> {madeiraDetalhe.densidade}</p>
                <p><strong className="text-stone-100">Origem & Manejo:</strong> {madeiraDetalhe.origem}</p>
                <p><strong className="text-stone-100">Uso Recomendado:</strong> {madeiraDetalhe.usoIdeal}</p>
              </div>

              <button
                onClick={() => {
                  setSimMadeira(madeiraDetalhe.nome);
                  setMadeiraDetalhe(null);
                  document.getElementById("simulador")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Configurar Projeto com esta Madeira
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulador de projeto sob medida */}
      <section id="simulador" className="py-28 px-6 bg-[#13110e] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-semibold">
              Simulador Autoral Ferrerlim
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 tracking-[-0.02em]">
              Planeje Sua Peça Sob Medida
            </h2>
            <p className="text-stone-400 mt-3 text-sm sm:text-base leading-relaxed">
              Selecione os parâmetros fundamentais para receber uma estimativa técnica detalhada e cronograma do ateliê.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Controles do Simulador */}
            <div className="lg:col-span-7 bg-[#171411] border border-white/[0.08] p-6 sm:p-8 rounded-3xl space-y-6">
              {/* Etapa 1: Tipo de Móvel */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 font-semibold">
                  1. Tipologia do Móvel
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {["Mesa de Jantar", "Aparador / Rack", "Cadeira / Poltrona", "Peça Autoral"].map((tipo) => (
                    <motion.button
                      type="button"
                      key={tipo}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSimTipo(tipo)}
                      className={`py-3 px-3 rounded-xl text-xs font-medium border text-center transition-all ${simTipo === tipo
                          ? "bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-lg shadow-amber-500/20"
                          : "bg-stone-900/60 text-stone-400 border-white/[0.06] hover:border-stone-700"
                        }`}
                    >
                      {tipo}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Etapa 2: Madeira Preferida */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 font-semibold">
                  2. Essência da Madeira
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    "Freijó Brasileiro",
                    "Cumaru Maciço",
                    "Nogueira Nobre",
                    "Peroba Demolição"
                  ].map((mad) => (
                    <motion.button
                      type="button"
                      key={mad}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSimMadeira(mad)}
                      className={`py-3 px-3 rounded-xl text-xs font-medium border text-center transition-all ${simMadeira === mad
                          ? "bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-lg shadow-amber-500/20"
                          : "bg-stone-900/60 text-stone-400 border-white/[0.06] hover:border-stone-700"
                        }`}
                    >
                      {mad}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Etapa 3: Dimensão / Escala */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 font-semibold">
                  3. Escala &amp; Dimensões Estimadas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    "200 × 100 cm (6 a 8 lugares)",
                    "240 × 100 cm (8 a 10 lugares)",
                    "300 × 110 cm (10 a 12 lugares)"
                  ].map((dim) => (
                    <motion.button
                      type="button"
                      key={dim}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSimDimensao(dim)}
                      className={`py-3 px-3 rounded-xl text-xs font-medium border text-center transition-all ${simDimensao === dim
                          ? "bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-lg shadow-amber-500/20"
                          : "bg-stone-900/60 text-stone-400 border-white/[0.06] hover:border-stone-700"
                        }`}
                    >
                      {dim}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Etapa 4: Acabamento & Toque */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 font-semibold">
                  4. Tipo de Acabamento Orgânico
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    "Óleo Acetinado & Cera de Abelha",
                    "Polimento Manual em Óleo de Tungue"
                  ].map((acab) => (
                    <motion.button
                      type="button"
                      key={acab}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSimAcabamento(acab)}
                      className={`py-3 px-3 rounded-xl text-xs font-medium border text-center transition-all ${simAcabamento === acab
                          ? "bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-lg shadow-amber-500/20"
                          : "bg-stone-900/60 text-stone-400 border-white/[0.06] hover:border-stone-700"
                        }`}
                    >
                      {acab}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Painel Resumo em Tempo Real & Formulário */}
            <div className="lg:col-span-5 bg-[#171411] border border-amber-500/30 p-6 sm:p-8 rounded-3xl space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  Resumo da Simulação
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-100">
                  {simTipo} sob medida
                </h3>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-[#12100d] border border-white/[0.06] text-xs">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-stone-400">Madeira:</span>
                  <span className="text-stone-200 font-medium">{simMadeira}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-stone-400">Dimensão:</span>
                  <span className="text-stone-200 font-medium">{simDimensao}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-stone-400">Acabamento:</span>
                  <span className="text-stone-200 font-medium">{simAcabamento}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-400">Tempo de Ateliê:</span>
                  <span className="text-amber-400 font-semibold font-mono">4 a 6 semanas</span>
                </div>
              </div>

              {formEnviado ? (
                <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center mx-auto">
                    <IconCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-stone-100">
                    Solicitação Recebida no Ateliê!
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Entraremos em contato com a viabilidade técnica e croquis preliminar em até 24 horas úteis.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnviarOrcamento} className="space-y-4">
                  <div>
                    <label htmlFor={`${formId}-nome`} className="block text-xs text-stone-400 mb-1">
                      Seu Nome Completo
                    </label>
                    <input
                      id={`${formId}-nome`}
                      type="text"
                      required
                      value={formNome}
                      onChange={(e) => setFormNome(e.target.value)}
                      placeholder="Ex: Carlos Mendonça"
                      className="w-full bg-[#12100d] border border-white/[0.08] rounded-xl px-4 py-3 text-stone-100 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`${formId}-tel`} className="block text-xs text-stone-400 mb-1">
                        Telefone / WhatsApp
                      </label>
                      <input
                        id={`${formId}-tel`}
                        type="tel"
                        required
                        value={formTelefone}
                        onChange={(e) => setFormTelefone(e.target.value)}
                        placeholder="(11) 98765-4321"
                        className="w-full bg-[#12100d] border border-white/[0.08] rounded-xl px-4 py-3 text-stone-100 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor={`${formId}-email`} className="block text-xs text-stone-400 mb-1">
                        E-mail
                      </label>
                      <input
                        id={`${formId}-email`}
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="carlos@exemplo.com"
                        className="w-full bg-[#12100d] border border-white/[0.08] rounded-xl px-4 py-3 text-stone-100 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${formId}-msg`} className="block text-xs text-stone-400 mb-1">
                      Notas Especiais de Arquitetura (Opcional)
                    </label>
                    <textarea
                      id={`${formId}-msg`}
                      rows={2}
                      value={formMensagem}
                      onChange={(e) => setFormMensagem(e.target.value)}
                      placeholder="Espaço disponível na sala de jantar, iluminação, tom do piso..."
                      className="w-full bg-[#12100d] border border-white/[0.08] rounded-xl px-4 py-3 text-stone-100 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20"
                    >
                      Solicitar Orçamento Formal
                    </motion.button>

                    <button
                      type="button"
                      onClick={() =>
                        handleWhatsApp(
                          `Olá, Ateliê Ferrerlim! Simulei no site um projeto de ${simTipo} em ${simMadeira} (${simDimensao}) com acabamento em ${simAcabamento}. Gostaria de orçar com vocês!`
                        )
                      }
                      className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <IconWhatsApp className="w-4 h-4" /> Enviar Configuração no WhatsApp
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-28 px-6 bg-[#110f0d] border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2 font-semibold">
              Reconhecimento &amp; Confiança
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-100 tracking-[-0.02em]">
              O Que Dizem Nossos Clientes e Parceiros
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEPOIMENTOS_CLIENTES.map((dep, index) => (
              <div
                key={index}
                className="p-7 rounded-2xl bg-[#161411] border border-white/[0.08] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed font-light">
                    &ldquo;{dep.texto}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <span className="font-serif font-bold text-stone-100 text-sm block">
                    {dep.autor}
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono block mt-0.5">
                    {dep.local} &bull; {dep.projeto}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Botão flutuante do WhatsApp */}
      <motion.button
        onClick={() => handleWhatsApp()}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-emerald-400/30 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        aria-label="Falar com o Marceneiro no WhatsApp"
      >
        <IconWhatsApp className="w-5 h-5" />
        <span className="hidden sm:inline-block text-xs font-bold tracking-wide">
          Ateliê Online
        </span>
      </motion.button>

      {/* Rodapé institucional */}
      <footer className="border-t border-white/[0.08] bg-[#0a0908] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3.5">
            <LogoFerrerlim className="w-9 h-9" />
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-stone-100">
                FERRERLIM
              </span>
              <p className="text-xs text-stone-400 mt-0.5">
                Ateliê de Marcenaria Autoral &bull; Madeira Maciça Certificada
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
            <span>{CONTATO_ATELIE.cidade}</span>
            <span>Telefone: {CONTATO_ATELIE.telefone}</span>
            <span>{CONTATO_ATELIE.email}</span>
          </div>

          <p className="text-[11px] font-mono text-stone-500">
            &copy; {new Date().getFullYear()} Ferrerlim. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
