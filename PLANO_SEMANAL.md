# 🪵 marceRI — Plano de Desenvolvimento Semana a Semana

> **Objetivo:** Construir um site de portfólio profissional para marcenaria artesanal, com frontend moderno e animado (React + Tailwind v4 + Motion) e backend robusto em Arquitetura Hexagonal + DDD + Clean Architecture (Node.js + Express 5 + Drizzle + PostgreSQL).
>
> **Filosofia do Plano:** **Fatias Verticais (Vertical Slices)**. Ao final de cada semana, você terá uma **versão funcional, executável e testável**, sem passar semanas "no escuro" programando só backend ou só frontend.

---

## 📅 Visão Geral do Cronograma

| Semana | Tema Central | Entrega Funcional ("Definition of Done") |
|---|---|---|
| **Semana 1** | **O Alicerce Monorepo & Primeira Fatia Fullstack** | Monorepo pnpm configurado, Postgres no Docker, backend Express 5 respondendo `/api/health`, frontend React exibindo status integrado com animação de pulso. |
| **Semana 2** | **Domínio Puro (DDD) & Adaptador CLI em Memória** | Entidades e Value Objects em TypeScript puro com 100% de testes unitários. CLI executável no terminal para cadastrar/listar projetos em memória. |
| **Semana 3** | **Persistência Real (Postgres + Drizzle) & API REST** | Migrations no Postgres, repositórios reais, pipeline de upload de imagens (Sharp gerando WebP 480/960/1600px) e rotas da API testáveis via HTTP/Postman. |
| **Semana 4** | **Frontend: Design System Artesanal & Shell Animado** | Tema Tailwind v4 (tons de madeira), Motion configurado, Header com scroll blur dinâmico, menu mobile animado, Page Transitions e navegação base. |
| **Semana 5** | **Vitrine: Home & Portfólio com Filtros e Stagger** | Hero animado, catálogo com filtros de categoria por pills animados (`layoutId`), grade responsiva com animação stagger e carregamento esqueleto (Skeleton). |
| **Semana 6** | **Detalhe do Móvel, Lightbox Interativo & Orçamento** | Página de projeto com galeria em alta resolução, Lightbox com gestos touch/swipe e zoom, formulário de orçamento com validação Zod + WhatsApp direto. |
| **Semana 7** | **CLI do Marceneiro, SEO, Core Web Vitals & Deploy** | CLI para cadastro de fotos reais, meta tags Open Graph/Schema.org, otimização de acessibilidade (`prefers-reduced-motion`) e deploy em VPS com Docker + Caddy. |

---

## 🏗️ Semana 1: O Alicerce Monorepo & Primeira Fatia Fullstack

### 🎯 Objetivo da Semana
Configurar o ambiente profissional monorepo com `pnpm`, orquestrar o banco local com Docker Compose, estruturar as 3 áreas do repositório (`apps/api`, `apps/web`, `packages/shared`) e fazer o frontend exibir dados do backend com sucesso.

### 📋 Checklist de Tarefas
- [ ] Inicializar repositório Git e `.gitattributes` para compatibilidade Windows/Linux.
- [ ] Criar `pnpm-workspace.yaml` e configurar o catálogo central de dependências.
- [ ] Configurar TypeScript base (`tsconfig.base.json`) e referências nos pacotes.
- [ ] Criar `docker-compose.yml` com PostgreSQL 16 e healthcheck ativo.
- [ ] Criar `packages/shared` com o primeiro contrato tipado (`HealthCheckResponseSchema`).
- [ ] Criar `apps/api` mínimo com Express 5 e rota `GET /api/health`.
- [ ] Criar `apps/web` com Vite + React 19 + Tailwind CSS v4.
- [ ] Conectar front e back: tela inicial exibindo card com badge pulsante "Sistema Online".

---

### 💻 Arquivos e Códigos da Semana 1

#### 1. `.gitattributes` (Raiz)
Padroniza finais de linha em ambientes Windows e Linux:
```gitattributes
* text=auto eol=lf
*.bat text eol=crlf
*.cmd text eol=crlf
```

#### 2. `pnpm-workspace.yaml` (Raiz)
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

#### 3. `package.json` (Raiz)
```json
{
  "name": "marceri",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "pnpm --parallel dev",
    "build": "pnpm --recursive build",
    "test": "pnpm --recursive test",
    "lint": "pnpm --recursive lint",
    "db:up": "docker compose up -d",
    "db:down": "docker compose down"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "prettier": "^3.5.0"
  }
}
```

#### 4. `docker-compose.yml` (Raiz)
```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: marceri-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: marceri
      POSTGRES_PASSWORD: marceri_dev_password
      POSTGRES_DB: marceri_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U marceri -d marceri_db"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

#### 5. `packages/shared/package.json`
```json
{
  "name": "@marceri/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "zod": "^3.24.2"
  }
}
```

#### 6. `packages/shared/src/index.ts`
```typescript
import { z } from "zod";

export const HealthCheckResponseSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string().datetime(),
  environment: z.string(),
  database: z.enum(["connected", "disconnected", "mock"])
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
```

#### 7. `apps/api/src/main/server.ts`
```typescript
import express from "express";
import cors from "cors";
import { HealthCheckResponse } from "@marceri/shared";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  const response: HealthCheckResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: "mock" // Na semana 3 ligamos no Postgres real
  };
  res.status(200).json(response);
});

app.listen(PORT, () => {
  console.log(`🌲 [marceRI API] Rodando na porta ${PORT}`);
});
```

#### 8. `apps/web/src/App.tsx` (Com visual inicial e micro-animação)
```tsx
import { useEffect, useState } from "react";
import { HealthCheckResponse } from "@marceri/shared";

export default function App() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3333/api/health")
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Falha ao conectar no back:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-stone-900 text-stone-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-stone-800/80 border border-stone-700 rounded-2xl p-8 backdrop-blur shadow-2xl">
        <span className="text-amber-500 font-mono text-sm uppercase tracking-widest block mb-2">Semana 1 — Setup</span>
        <h1 className="text-3xl font-serif font-bold text-stone-50">marceRI</h1>
        <p className="text-stone-400 mt-2 text-sm leading-relaxed">
          Ateliê de Marcenaria Artesanal &middot; Laboratório de Arquitetura Limpa
        </p>

        <div className="mt-8 border-t border-stone-700/60 pt-6">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Status do Backend</p>
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <span className="text-sm text-stone-300">Conectando à API...</span>
            </div>
          ) : health ? (
            <div className="flex items-center justify-between bg-stone-900/60 p-4 rounded-xl border border-stone-700/50">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-medium text-emerald-400">Servidor Ativo</span>
              </div>
              <span className="text-xs font-mono text-stone-400">{health.environment}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-400 text-sm">
              <span>⚠️ API desconectada. Execute o backend!</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
```

### 🔬 Critério de Validação da Semana 1
Executar `pnpm db:up` e depois `pnpm dev`. Abrir `http://localhost:5173` no navegador e ver o card com a luz verde piscando confirmando resposta do servidor em `http://localhost:3333/api/health`.

---

## 🪵 Semana 2: Domínio Puro (DDD) & Adaptador CLI em Memória

### 🎯 Objetivo da Semana
Construir o coração do software (**Domain Layer** e **Application Layer**) com DDD estrito, sem qualquer dependência de frameworks externos (sem Express, sem Drizzle, sem Zod dentro do domínio). Provar a elegância da Arquitetura Hexagonal criando um **Adaptador CLI de terminal** que cadastra e lista projetos utilizando os casos de uso com um repositório em memória.

### 📋 Checklist de Tarefas
- [ ] Implementar Value Objects auto-validados: `Slug`, `Email`, `Telefone`, `StatusSolicitacao`.
- [ ] Implementar hierarquia de erros de domínio: `DomainError`, `NaoEncontradoError`, `ConflitoError`, `RegraVioladaError`.
- [ ] Implementar a Entidade Agregada Raiz `Projeto` e as entidades `Imagem`, `Categoria`.
- [ ] Blindar as invariantes de negócio de `Projeto`:
  - Não pode publicar sem ao menos 1 imagem e 1 categoria associada.
  - Exatamente uma imagem deve ser a capa; se nenhuma for indicada, a primeira vira capa.
  - Ordem das imagens deve ser contínua (1..n).
- [ ] Definir as Portas de Saída (driven ports): `ProjetoRepository`, `CategoriaRepository`.
- [ ] Implementar Casos de Uso (Application Service): `CriarProjeto`, `PublicarProjeto`, `ListarProjetos`.
- [ ] Criar `InMemoryProjetoRepository` e criar bateria completa de testes unitários com Vitest.
- [ ] Construir o Adaptador de Entrada CLI (`apps/api/src/interface/cli/`) usando Commander para cadastrar e listar projetos direto pelo terminal.

---

### 💻 Códigos da Semana 2

#### 1. Value Object: `Slug.ts` (`apps/api/src/modules/portfolio/domain/value-objects/Slug.ts`)
```typescript
import { RegraVioladaError } from "../../../../shared/errors/DomainError";

export class Slug {
  private readonly _valor: string;

  private constructor(valor: string) {
    this._valor = valor;
  }

  public static criar(texto: string): Slug {
    if (!texto || texto.trim().length === 0) {
      throw new RegraVioladaError("O texto para o slug não pode ser vazio.");
    }

    const normalizado = texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (normalizado.length < 2) {
      throw new RegraVioladaError("O slug gerado deve ter pelo menos 2 caracteres.");
    }

    return new Slug(normalizado);
  }

  public get valor(): string {
    return this._valor;
  }
}
```

#### 2. Entidade de Domínio: `Imagem.ts`
```typescript
import { RegraVioladaError } from "../../../../shared/errors/DomainError";

export interface ImagemProps {
  id: string;
  chaveStorage: string; // Ex: uploads/2026/mesa-yp-1.webp
  alt: string;
  ordem: number;
  capa: boolean;
}

export class Imagem {
  private props: ImagemProps;

  constructor(props: ImagemProps) {
    if (!props.chaveStorage) throw new RegraVioladaError("Chave de storage é obrigatória.");
    if (props.ordem < 1) throw new RegraVioladaError("A ordem da imagem deve ser >= 1.");
    this.props = { ...props };
  }

  get id() { return this.props.id; }
  get chaveStorage() { return this.props.chaveStorage; }
  get alt() { return this.props.alt; }
  get ordem() { return this.props.ordem; }
  get capa() { return this.props.capa; }

  tornarCapa() { this.props.capa = true; }
  removerCapa() { this.props.capa = false; }
  definirOrdem(novaOrdem: number) { this.props.ordem = novaOrdem; }
}
```

#### 3. Agregado Raiz: `Projeto.ts`
```typescript
import { Slug } from "./value-objects/Slug";
import { Imagem } from "./Imagem";
import { RegraVioladaError } from "../../../../shared/errors/DomainError";

export interface ProjetoProps {
  id: string;
  titulo: string;
  slug: Slug;
  descricao: string;
  categoriaId: string;
  ano?: number;
  materiais: string[];
  destaque: boolean;
  publicado: boolean;
  imagens: Imagem[];
  criadoEm: Date;
  atualizadoEm: Date;
}

export class Projeto {
  private constructor(private props: ProjetoProps) {
    this.ajustarCapaEOrdem();
  }

  public static criar(dados: {
    id: string;
    titulo: string;
    descricao?: string;
    categoriaId: string;
    ano?: number;
    materiais?: string[];
    destaque?: boolean;
  }): Projeto {
    if (!dados.titulo || dados.titulo.trim().length < 3) {
      throw new RegraVioladaError("O título do projeto deve ter no mínimo 3 caracteres.");
    }
    if (!dados.categoriaId) {
      throw new RegraVioladaError("O projeto precisa ter uma categoria vinculada.");
    }

    return new Projeto({
      id: dados.id,
      titulo: dados.titulo.trim(),
      slug: Slug.criar(dados.titulo),
      descricao: dados.descricao || "",
      categoriaId: dados.categoriaId,
      ano: dados.ano || new Date().getFullYear(),
      materiais: dados.materiais || [],
      destaque: dados.destaque || false,
      publicado: false,
      imagens: [],
      criadoEm: new Date(),
      atualizadoEm: new Date()
    });
  }

  public adicionarImagem(imagem: Imagem): void {
    this.props.imagens.push(imagem);
    this.ajustarCapaEOrdem();
    this.props.atualizadoEm = new Date();
  }

  public publicar(): void {
    if (!this.props.categoriaId) {
      throw new RegraVioladaError("Não é possível publicar um projeto sem categoria.");
    }
    if (this.props.imagens.length === 0) {
      throw new RegraVioladaError("Não é possível publicar um projeto sem ao menos uma imagem.");
    }
    this.props.publicado = true;
    this.props.atualizadoEm = new Date();
  }

  public despublicar(): void {
    this.props.publicado = false;
    this.props.atualizadoEm = new Date();
  }

  private ajustarCapaEOrdem(): void {
    if (this.props.imagens.length === 0) return;

    const capas = this.props.imagens.filter((i) => i.capa);
    if (capas.length === 0) {
      this.props.imagens[0].tornarCapa();
    } else if (capas.length > 1) {
      capas.forEach((img, idx) => {
        if (idx > 0) img.removerCapa();
      });
    }

    // Reordena sequencialmente 1..n
    this.props.imagens.forEach((img, idx) => {
      img.definirOrdem(idx + 1);
    });
  }

  // Getters imutáveis
  get id() { return this.props.id; }
  get titulo() { return this.props.titulo; }
  get slug() { return this.props.slug.valor; }
  get descricao() { return this.props.descricao; }
  get categoriaId() { return this.props.categoriaId; }
  get publicado() { return this.props.publicado; }
  get destaque() { return this.props.destaque; }
  get imagens() { return [...this.props.imagens]; }
}
```

#### 4. Caso de Uso: `CriarProjeto.ts`
```typescript
import { Projeto } from "../domain/Projeto";
import { ProjetoRepository } from "../ports/ProjetoRepository";
import { CategoriaRepository } from "../ports/CategoriaRepository";
import { ConflitoError, NaoEncontradoError } from "../../../../shared/errors/DomainError";

export interface CriarProjetoInput {
  titulo: string;
  descricao?: string;
  categoriaId: string;
  ano?: number;
  materiais?: string[];
  destaque?: boolean;
}

export class CriarProjetoUseCase {
  constructor(
    private projetoRepo: ProjetoRepository,
    private categoriaRepo: CategoriaRepository
  ) {}

  async execute(input: CriarProjetoInput): Promise<{ id: string; slug: string }> {
    const categoriaExiste = await this.categoriaRepo.buscarPorId(input.categoriaId);
    if (!categoriaExiste) {
      throw new NaoEncontradoError(`Categoria com ID ${input.categoriaId} não foi encontrada.`);
    }

    const projeto = Projeto.criar({
      id: crypto.randomUUID(),
      titulo: input.titulo,
      descricao: input.descricao,
      categoriaId: input.categoriaId,
      ano: input.ano,
      materiais: input.materiais,
      destaque: input.destaque
    });

    const slugEmUso = await this.projetoRepo.buscarPorSlug(projeto.slug);
    if (slugEmUso) {
      throw new ConflitoError(`Já existe um projeto com o slug "${projeto.slug}".`);
    }

    await this.projetoRepo.salvar(projeto);
    return { id: projeto.id, slug: projeto.slug };
  }
}
```

#### 5. O Adaptador CLI de Demonstração (`apps/api/src/interface/cli/index.ts`)
```typescript
import { Command } from "commander";
import { InMemoryProjetoRepository } from "../../modules/portfolio/infrastructure/InMemoryProjetoRepository";
import { InMemoryCategoriaRepository } from "../../modules/portfolio/infrastructure/InMemoryCategoriaRepository";
import { CriarProjetoUseCase } from "../../modules/portfolio/application/use-cases/CriarProjeto";
import { Categoria } from "../../modules/portfolio/domain/Categoria";

const program = new Command();
const projetoRepo = new InMemoryProjetoRepository();
const categoriaRepo = new InMemoryCategoriaRepository();

// Seed de categoria para o CLI
await categoriaRepo.salvar(new Categoria({ id: "cat-1", nome: "Mesas de Jantar", slug: "mesas-de-jantar" }));

program
  .name("marceri-cli")
  .description("CLI de Demonstração de Casos de Uso")
  .version("1.0.0");

program
  .command("criar-projeto")
  .argument("<titulo>", "Título do projeto")
  .action(async (titulo) => {
    try {
      const useCase = new CriarProjetoUseCase(projetoRepo, categoriaRepo);
      const resultado = await useCase.execute({
        titulo,
        categoriaId: "cat-1",
        descricao: "Criado via CLI para teste de arquitetura"
      });
      console.log("✅ Projeto criado com sucesso!");
      console.log(`ID: ${resultado.id} | Slug: ${resultado.slug}`);
    } catch (err: any) {
      console.error(`❌ Erro de Domínio: ${err.message}`);
    }
  });

program.parse(process.argv);
```

### 🔬 Critério de Validação da Semana 2
1. Rodar `pnpm --filter api test` e passar 100% dos testes unitários de regras de negócio (publicação sem imagem falha, slug com caracteres especiais normaliza perfeitamente).
2. Executar `pnpm --filter api cli criar-projeto "Mesa Rústica em Peroba Rosa"` e conferir no console o slug gerado `mesa-rustica-em-peroba-rosa`.

---

## 💾 Semana 3: Persistência Real (Postgres + Drizzle) & API REST

### 🎯 Objetivo da Semana
Tirar os repositórios da memória e conectar o banco relacional real. Gerar migrations com Drizzle ORM, implementar o pipeline de processamento de imagens com `sharp` (WebP responsivo), criar endpoints REST no Express 5 e garantir que o error handler global traduza exceções de domínio em códigos HTTP precisos (404, 409, 422).

### 📋 Checklist de Tarefas
- [ ] Modelar schema Drizzle em `apps/api/src/shared/infra/database/schema.ts`.
- [ ] Aplicar índices recomendados: `(publicado, destaque)`, `categoria_id` e unique parcial em `capa`.
- [ ] Rodar migrations via `drizzle-kit push` ou `drizzle-kit generate`.
- [ ] Criar script de Seed com 3 categorias e 4 projetos completos de marcenaria.
- [ ] Implementar `DrizzleProjetoRepository` implementando a porta `ProjetoRepository`.
- [ ] Criar adaptador de armazenamento em disco `LocalDiskImageStorage` com `sharp`.
- [ ] Implementar rotas públicas (`/api/projetos`, `/api/categorias`) e protegidas (`/api/admin/*` com header `x-api-key`).
- [ ] Implementar middleware centralizado de tratamento de erros no Express.

---

### 💻 Códigos da Semana 3

#### 1. Schema Drizzle (`apps/api/src/shared/infra/database/schema.ts`)
```typescript
import { pgTable, uuid, text, smallint, boolean, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const categoriasTable = pgTable("categorias", {
  id: uuid("id").primaryKey(),
  nome: text("nome").notNull().unique(),
  slug: text("slug").notNull().unique()
});

export const projetosTable = pgTable("projetos", {
  id: uuid("id").primaryKey(),
  titulo: text("titulo").notNull(),
  slug: text("slug").notNull().unique(),
  descricao: text("descricao").notNull().default(""),
  categoriaId: uuid("categoria_id").notNull().references(() => categoriasTable.id, { onDelete: "restrict" }),
  ano: smallint("ano"),
  materiais: text("materiais").array().notNull().default(sql`'{}'::text[]`),
  destaque: boolean("destaque").notNull().default(false),
  publicado: boolean("publicado").notNull().default(false),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("idx_projetos_categoria").on(table.categoriaId),
  index("idx_projetos_publicado_destaque").on(table.publicado, table.destaque)
]);

export const imagensProjetoTable = pgTable("imagens_projeto", {
  id: uuid("id").primaryKey(),
  projetoId: uuid("projeto_id").notNull().references(() => projetosTable.id, { onDelete: "cascade" }),
  chave: text("chave").notNull(),
  alt: text("alt").notNull().default(""),
  ordem: smallint("ordem").notNull(),
  capa: boolean("capa").notNull().default(false)
}, (table) => [
  uniqueIndex("imagens_uma_capa_por_projeto").on(table.projetoId).where(sql`capa = true`)
]);
```

#### 2. Pipeline de Otimização de Imagens com Sharp (`apps/api/src/modules/portfolio/infrastructure/LocalDiskImageStorage.ts`)
```typescript
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import { ImageStorage } from "../application/ports/ImageStorage";

export class LocalDiskImageStorage implements ImageStorage {
  private baseDir = path.resolve(process.cwd(), "uploads");

  async salvarVariantes(bufferOriginal: Buffer, nomeBase: string): Promise<string> {
    await fs.mkdir(this.baseDir, { recursive: true });

    const larguras = [480, 960, 1600];
    const chaveRelativa = `${nomeBase}`;

    // Gera as 3 variantes responsivas em WebP
    for (const w of larguras) {
      const destino = path.join(this.baseDir, `${nomeBase}-${w}w.webp`);
      await sharp(bufferOriginal)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toFile(destino);
    }

    return chaveRelativa;
  }
}
```

#### 3. Error Handler Centralizado do Express 5
```typescript
import { ErrorRequestHandler } from "express";
import { DomainError, NaoEncontradoError, ConflitoError, RegraVioladaError } from "../shared/errors/DomainError";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      erro: "Dados inválidos na requisição.",
      detalhes: err.flatten().fieldErrors
    });
  }

  if (err instanceof NaoEncontradoError) {
    return res.status(404).json({ erro: err.message });
  }

  if (err instanceof ConflitoError) {
    return res.status(409).json({ erro: err.message });
  }

  if (err instanceof RegraVioladaError) {
    return res.status(422).json({ erro: err.message });
  }

  // Falha inesperada (500) — log com detalhe no servidor, oculto para o cliente
  console.error("🔥 [Erro Não Tratado]:", err);
  return res.status(500).json({ erro: "Erro interno no servidor." });
};
```

### 🔬 Critério de Validação da Semana 3
1. Executar o script de seed populando o Postgres com projetos de exemplo.
2. Fazer `GET http://localhost:3333/api/projetos` via navegador ou curl e receber a listagem JSON com variantes WebP formatadas.
3. Testar a proteção: `POST http://localhost:3333/api/admin/projetos` sem o header `x-api-key` deve retornar `401 Unauthorized`.

---

## 🎨 Semana 4: Frontend: Design System Artesanal & Shell Animado

### 🎯 Objetivo da Semana
Configurar o design system em **Tailwind CSS v4** evocando texturas orgânicas e acolhedoras de marcenaria (nogueira, carvalho, linho natural, âmbar), instalar **Motion** (`motion/react`) e construir o layout mestre da aplicação com header dinâmico e transições de tela fluidas.

### 📋 Checklist de Tarefas
- [ ] Configurar `@theme` no CSS do Tailwind v4 com a paleta exclusiva de madeiras e tipografia.
- [ ] Configurar React Router v7 com `<AnimatedRoutes>` e `<AnimatePresence mode="wait">`.
- [ ] Construir o componente reutilizável `<PageTransition>` com curvas Bézier naturais.
- [ ] Criar o `<Header>` inteligente:
  - Fundo transparente quando no topo da página.
  - Transição para fundo vidro/blur (`bg-stone-900/80 backdrop-blur-md`) após 40px de scroll.
  - Indicador de link ativo com sublinhado animado.
  - Menu hambúrguer mobile com transição suave em tela cheia.
- [ ] Criar o `<Footer>` com créditos e atalhos rápidos.
- [ ] Configurar TanStack Query v5 no `RootLayout`.

---

### 💻 Códigos da Semana 4

#### 1. `apps/web/src/index.css` (Tailwind CSS v4 com `@theme`)
```css
@import "tailwindcss";

@theme {
  /* Cores inspiradas em madeiras nobres e acabamentos artesanais */
  --color-madeira-clara: #e6d5b8;
  --color-nogueira-500: #8c5835;
  --color-nogueira-700: #59351e;
  --color-nogueira-900: #331d10;
  
  --color-ambar-ouro: #d97706;
  --color-palha: #fdfbf7;
  --color-grafite-carvao: #171614;

  /* Fontes elegantes para artesanato */
  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans: "Inter", -apple-system, sans-serif;

  /* Curvas de transição suaves */
  --ease-madeira: cubic-bezier(0.22, 1, 0.36, 1);
}

body {
  background-color: var(--color-grafite-carvao);
  color: var(--color-palha);
  font-family: var(--font-sans);
  overflow-x: hidden;
}
```

#### 2. Wrapper Reutilizável de Transição: `apps/web/src/shared/animations/PageTransition.tsx`
```tsx
import { motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -12,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
  }
};

export function PageTransition({ children }: Props) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-[calc(100vh-160px)]"
    >
      {children}
    </motion.div>
  );
}
```

#### 3. Header com Efeito de Scroll e Menu Mobile (`apps/web/src/shared/layout/Header.tsx`)
```tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fecha menu mobile ao trocar de página
  useEffect(() => {
    setMenuAberto(false);
  }, [location.pathname]);

  const links = [
    { nome: "Início", path: "/" },
    { nome: "Portfólio", path: "/portfolio" },
    { nome: "O Marceneiro", path: "/sobre" },
    { nome: "Orçamento", path: "/contato" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-stone-950/85 backdrop-blur-md border-b border-stone-800/60 py-3 shadow-lg"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-100 group-hover:text-amber-500 transition-colors">
            marce<span className="text-amber-600">RI</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const ativo = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors hover:text-amber-400 ${
                  ativo ? "text-stone-100" : "text-stone-400"
                }`}
              >
                {link.nome}
                {ativo && (
                  <motion.div
                    layoutId="header-active-pill"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Botão Mobile */}
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Abrir Menu de Navegação"
          className="md:hidden p-2 text-stone-300 hover:text-stone-100 focus:outline-none"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`h-0.5 w-full bg-current transform transition-transform ${menuAberto ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-full bg-current transition-opacity ${menuAberto ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-current transform transition-transform ${menuAberto ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Drawer Mobile Animado */}
      <AnimatePresence>
        {menuAberto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-stone-950/95 border-b border-stone-800 px-6 py-6"
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-lg font-serif text-stone-200 hover:text-amber-500 py-1"
                >
                  {link.nome}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
```

### 🔬 Critério de Validação da Semana 4
Navegar entre as rotas configuradas (`/`, `/portfolio`, `/sobre`, `/contato`) e observar a transição suave de fade e subida de conteúdo sem flash branco na tela. No celular ou DevTools em modo mobile, testar a abertura e fechamento fluido do menu hambúrguer.

---

## 🖼️ Semana 5: Vitrine: Home & Portfólio com Filtros e Stagger

### 🎯 Objetivo da Semana
Criar a experiência visual onde os móveis do marceneiro brilham: Hero impactante com chamada para ação, catálogo com filtros de categoria por abas com transição suave (`layoutId`) e grid com entrada sequenciada (*stagger animation*) e carregamento com esqueleto visual.

### 📋 Checklist de Tarefas
- [ ] Criar o hook de dados `useProjetosQuery` e `useCategoriasQuery` com TanStack Query v5.
- [ ] Desenvolver o Hero da Home com entrada em cascata de texto e imagem.
- [ ] Construir o componente `<ProjetoCard>` com efeito de zoom suave na foto ao passar o mouse.
- [ ] Implementar a página `/portfolio` com filtro dinâmico de categorias.
- [ ] Integrar `AnimatePresence` no grid para que os cards que saem e entram se reorganizem suavemente (`motion.div layout`).
- [ ] Construir o `<SkeletonCard>` para manter a estabilidade de layout (Zero Cumulative Layout Shift).

---

### 💻 Códigos da Semana 5

#### 1. Grade de Portfólio com Filtro Fluido (`apps/web/src/features/portfolio/pages/PortfolioPage.tsx`)
```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PageTransition } from "../../../shared/animations/PageTransition";
import { ProjetoCard } from "../components/ProjetoCard";
import { useProjetosQuery } from "../hooks/useProjetosQuery";
import { useCategoriasQuery } from "../hooks/useCategoriasQuery";

export function PortfolioPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("todas");
  const { data: projetos, isLoading } = useProjetosQuery();
  const { data: categorias } = useCategoriasQuery();

  const projetosFiltrados = projetos?.filter((p) =>
    categoriaAtiva === "todas" ? true : p.categoriaSlug === categoriaAtiva
  );

  return (
    <PageTransition>
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
        <header className="max-w-2xl mb-12">
          <span className="text-amber-500 font-mono text-xs uppercase tracking-widest block mb-2">Trabalhos Selecionados</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-100">Criações em Madeira</h1>
          <p className="text-stone-400 mt-3 text-base leading-relaxed">
            Móveis autorais sob medida, restaurações criteriosas e peças que combinam marcenaria clássica com ergonomia contemporânea.
          </p>
        </header>

        {/* Pílulas de Filtro com Layout Animation */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            onClick={() => setCategoriaAtiva("todas")}
            className={`relative px-4 py-2 text-sm rounded-full transition-colors ${
              categoriaAtiva === "todas" ? "text-stone-950 font-semibold" : "text-stone-400 hover:text-stone-200"
            }`}
          >
            {categoriaAtiva === "todas" && (
              <motion.div
                layoutId="categoria-pill-bg"
                className="absolute inset-0 bg-amber-500 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">Todas as Peças</span>
          </button>

          {categorias?.map((cat) => {
            const ativo = categoriaAtiva === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.slug)}
                className={`relative px-4 py-2 text-sm rounded-full transition-colors ${
                  ativo ? "text-stone-950 font-semibold" : "text-stone-400 hover:text-stone-200"
                }`}
              >
                {ativo && (
                  <motion.div
                    layoutId="categoria-pill-bg"
                    className="absolute inset-0 bg-amber-500 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.nome}</span>
              </button>
            );
          })}
        </div>

        {/* Grade com Stagger e Reorganização Fluida */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4 animate-pulse">
                    <div className="aspect-[4/3] bg-stone-800 rounded-2xl" />
                    <div className="h-5 bg-stone-800 rounded w-3/4" />
                    <div className="h-4 bg-stone-800 rounded w-1/2" />
                  </div>
                ))
              : projetosFiltrados?.map((projeto) => (
                  <motion.div
                    key={projeto.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.35 }}
                  >
                    <ProjetoCard projeto={projeto} />
                  </motion.div>
                ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageTransition>
  );
}
```

#### 2. Card de Projeto com Hover Elegante (`apps/web/src/features/portfolio/components/ProjetoCard.tsx`)
```tsx
import { Link } from "react-router-dom";
import { ProjetoDTO } from "@marceri/shared";

export function ProjetoCard({ projeto }: { projeto: ProjetoDTO }) {
  const capa = projeto.imagens.find((img) => img.capa) || projeto.imagens[0];

  return (
    <Link to={`/portfolio/${projeto.slug}`} className="group block focus:outline-none">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-800 border border-stone-800/80">
        <img
          src={`http://localhost:3333/uploads/${capa.chave}-960w.webp`}
          alt={capa.alt || projeto.titulo}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        <span className="absolute top-4 right-4 text-xs font-mono bg-stone-900/80 backdrop-blur px-2.5 py-1 rounded-md text-amber-400 border border-stone-700/50">
          {projeto.ano}
        </span>
      </div>

      <div className="mt-4">
        <span className="text-xs uppercase tracking-wider text-amber-500 font-medium">
          {projeto.categoriaNome}
        </span>
        <h3 className="text-xl font-serif font-bold text-stone-100 group-hover:text-amber-400 transition-colors mt-0.5">
          {projeto.titulo}
        </h3>
        <p className="text-sm text-stone-400 line-clamp-2 mt-1">
          {projeto.descricao}
        </p>
      </div>
    </Link>
  );
}
```

### 🔬 Critério de Validação da Semana 5
Acessar `/portfolio`, clicar nas pílulas de categorias e observar a animação elástica do fundo da pílula selecionada e o reposicionamento dos cards na tela sem solavancos.

---

## 🔍 Semana 6: Detalhe do Móvel, Lightbox Interativo & Orçamento

### 🎯 Objetivo da Semana
Entregar a experiência de conversão: o visitante pode inspecionar as fotos do móvel em alta definição em um Lightbox que responde a toques no celular (swipe/pinch) e atalhos no teclado, e pode solicitar um orçamento através de um formulário validado pelo Zod ou via link direto no WhatsApp.

### 📋 Checklist de Tarefas
- [ ] Construir a página de Detalhe do Projeto (`/portfolio/:slug`).
- [ ] Desenvolver o componente `<Lightbox>` fullscreen com Motion:
  - Navegação por teclado (Seta Esquerda, Seta Direita, Escape).
  - Gestos de arrastar para fechar (drag-to-dismiss) no mobile.
  - Indicador numérico (Ex: "3 / 8 fotos").
- [ ] Implementar caso de uso `EnviarSolicitacaoOrcamento` no backend com rate limit (`express-rate-limit`) e honeypot anti-spam.
- [ ] Construir o formulário de orçamento com `react-hook-form` e `@hookform/resolvers/zod`.
- [ ] Adicionar botão flutuante de WhatsApp com animação de pulso convidativo.

---

### 💻 Códigos da Semana 6

#### 1. Lightbox Fluído e Acessível (`apps/web/src/shared/ui/Lightbox.tsx`)
```tsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LightboxProps {
  isOpen: boolean;
  imagens: { chave: string; alt: string }[];
  indiceAtual: number;
  onClose: () => void;
  onAnterior: () => void;
  onProxima: () => void;
}

export function Lightbox({ isOpen, imagens, indiceAtual, onClose, onAnterior, onProxima }: LightboxProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onAnterior();
      if (e.key === "ArrowRight") onProxima();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onAnterior, onProxima, onClose]);

  const imagem = imagens[indiceAtual];

  return (
    <AnimatePresence>
      {isOpen && imagem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-md p-4"
          onClick={onClose}
        >
          {/* Contador */}
          <div className="absolute top-6 left-6 text-sm font-mono text-stone-400">
            {indiceAtual + 1} / {imagens.length}
          </div>

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-stone-400 hover:text-stone-100 p-2 text-xl"
            aria-label="Fechar galeria"
          >
            ✕
          </button>

          {/* Imagem Central com Animação Spring */}
          <motion.div
            key={imagem.chave}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
          >
            <img
              src={`http://localhost:3333/uploads/${imagem.chave}-1600w.webp`}
              alt={imagem.alt}
              className="max-h-[80vh] w-auto rounded-lg shadow-2xl object-contain"
            />
            {imagem.alt && (
              <p className="mt-3 text-sm text-stone-400 text-center">{imagem.alt}</p>
            )}
          </motion.div>

          {/* Setas de Navegação */}
          {imagens.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onAnterior(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-stone-300 hover:text-amber-400 bg-stone-900/60 rounded-full backdrop-blur border border-stone-800"
                aria-label="Foto anterior"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onProxima(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-stone-300 hover:text-amber-400 bg-stone-900/60 rounded-full backdrop-blur border border-stone-800"
                aria-label="Próxima foto"
              >
                ›
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

#### 2. Formulário de Orçamento Seguro (`apps/web/src/features/contato/pages/ContatoPage.tsx`)
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SolicitacaoOrcamentoInputSchema, SolicitacaoOrcamentoInput } from "@marceri/shared";
import { useState } from "react";
import { motion } from "motion/react";
import { PageTransition } from "../../../shared/animations/PageTransition";

export function ContatoPage() {
  const [enviado, setEnviado] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SolicitacaoOrcamentoInput>({
    resolver: zodResolver(SolicitacaoOrcamentoInputSchema)
  });

  const onSubmit = async (dados: SolicitacaoOrcamentoInput) => {
    const res = await fetch("http://localhost:3333/api/solicitacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (res.ok) setEnviado(true);
  };

  return (
    <PageTransition>
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-serif font-bold text-stone-100">Solicitar Orçamento</h1>
        <p className="text-stone-400 mt-2 mb-8">Conte sua ideia. Fabricamos sob medida com madeiras maciças certificadas.</p>

        {enviado ? (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-950/40 border border-emerald-800/60 p-8 rounded-2xl text-center">
            <span className="text-3xl block mb-2">🪵</span>
            <h3 className="text-xl font-bold text-emerald-300">Mensagem Recebida com Sucesso!</h3>
            <p className="text-stone-400 text-sm mt-1">O marceneiro entrará em contato em até 24 horas úteis.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Honeypot Oculto anti-bot */}
            <input type="text" {...register("website" as any)} className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Seu Nome</label>
              <input {...register("nome")} className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-500 focus:outline-none" />
              {errors.nome && <span className="text-xs text-rose-400 mt-1">{errors.nome.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">E-mail</label>
                <input type="email" {...register("email")} className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-500 focus:outline-none" />
                {errors.email && <span className="text-xs text-rose-400 mt-1">{errors.email.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">WhatsApp / Telefone</label>
                <input {...register("telefone")} placeholder="(11) 99999-9999" className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Descreva a peça ou projeto</label>
              <textarea {...register("mensagem")} rows={5} placeholder="Ex: Gostaria de uma mesa de jantar em Peroba Rosa para 8 lugares..." className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 focus:border-amber-500 focus:outline-none" />
              {errors.mensagem && <span className="text-xs text-rose-400 mt-1">{errors.mensagem.message}</span>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3.5 px-6 rounded-xl transition-colors">
              {isSubmitting ? "Enviando..." : "Enviar Pedido de Orçamento"}
            </button>
          </form>
        )}
      </div>
    </PageTransition>
  );
}
```

### 🔬 Critério de Validação da Semana 6
1. Abrir um projeto, clicar em uma imagem e verificar a abertura do Lightbox, navegando pelas setas do teclado e fechando no ESC.
2. Preencher e submeter o formulário de contato, verificando a persistência no banco e a troca imediata para a tela de agradecimento animada.

---

## 🚀 Semana 7: CLI do Marceneiro, SEO, Core Web Vitals & Deploy

### 🎯 Objetivo da Semana
Finalizar os detalhes de produto e colocar o site no ar com alta performance: CLI para upload das fotos reais do marceneiro sem precisar de painel admin, meta tags completas para compartilhamento no WhatsApp/Instagram, auditoria de acessibilidade e deploy com Docker Compose e Caddy (com HTTPS automático).

### 📋 Checklist de Tarefas
- [ ] Construir a CLI definitiva de gestão (`apps/api/src/interface/cli/admin-cli.ts`) permitindo criar categoria e fazer upload de fotos com multipart para a API usando o header `x-api-key`.
- [ ] Cadastrar os projetos reais (6 a 10 fotos profissionais de trabalhos).
- [ ] Implementar meta tags dinâmicas no frontend (React 19 `<title>` e `<meta name="description">`), Open Graph e `sitemap.xml`.
- [ ] Criar dados estruturados JSON-LD (`schema.org/HomeAndConstructionBusiness`).
- [ ] Garantir que animações respeitem `prefers-reduced-motion: reduce`.
- [ ] Rodar auditoria do Google Lighthouse: atingir **Performance ≥ 90**, **Acessibilidade ≥ 95** e **SEO ≥ 95**.
- [ ] Configurar Caddyfile e `docker-compose.prod.yml` para deploy em VPS.

---

### 💻 Códigos da Semana 7

#### 1. CLI de Cadastro com Upload Multipart (`apps/api/src/interface/cli/admin-cli.ts`)
```typescript
import { Command } from "commander";
import fs from "node:fs";

const program = new Command();
const API_URL = process.env.API_URL || "http://localhost:3333/api/admin";
const API_KEY = process.env.ADMIN_API_KEY || "troque-por-um-valor-longo-e-aleatorio";

program
  .name("marceri-admin")
  .description("CLI de Gestão de Conteúdo do Marceneiro");

program
  .command("subir-foto")
  .requiredOption("-p, --projeto <id>", "ID do projeto")
  .requiredOption("-f, --arquivo <caminho>", "Caminho do arquivo de imagem")
  .option("-a, --alt <texto>", "Texto alternativo da imagem", "")
  .option("-c, --capa", "Definir esta imagem como capa", false)
  .action(async (options) => {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(options.arquivo);
    const blob = new Blob([fileBuffer]);
    formData.append("imagem", blob, options.arquivo);
    formData.append("alt", options.alt);
    formData.append("capa", String(options.capa));

    const res = await fetch(`${API_URL}/projetos/${options.projeto}/imagens`, {
      method: "POST",
      headers: { "x-api-key": API_KEY },
      body: formData
    });

    if (res.ok) {
      console.log("📸 Imagem processada e salva com sucesso!");
    } else {
      console.error("❌ Falha no upload:", await res.text());
    }
  });

program.parse(process.argv);
```

#### 2. Configuração do Caddy para Produção (`deploy/Caddyfile`)
```caddy
{$DOMAIN:marceri.com.br} {
    encode zstd gzip

    # Headers de Segurança
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }

    # Proxy reverso para API
    handle /api/* {
        reverse_proxy api:3333
    }

    # Cache longo para uploads WebP já otimizados
    handle /uploads/* {
        header Cache-Control "public, max-age=31536000, immutable"
        reverse_proxy api:3333
    }

    # Servir build estático do Frontend (SPA)
    handle {
        root * /srv/web
        try_files {path} /index.html
        file_server
    }
}
```

#### 3. Docker Compose de Produção (`docker-compose.prod.yml`)
```yaml
services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      - DOMAIN=marceri.com.br
    volumes:
      - ./deploy/Caddyfile:/etc/caddy/Caddyfile
      - ./apps/web/dist:/srv/web
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - api

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3333
      - DATABASE_URL=postgres://marceri:${DB_PASSWORD}@postgres:5432/marceri_db
      - ADMIN_API_KEY=${ADMIN_API_KEY}
      - CORS_ORIGIN=https://marceri.com.br
    volumes:
      - uploads_data:/app/uploads
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: marceri
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: marceri_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U marceri -d marceri_db"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  caddy_data:
  caddy_config:
  postgres_data:
  uploads_data:
```

### 🔬 Critério de Validação da Semana 7
1. O site está acessível publicamente via HTTPS com certificado SSL válido.
2. Compartilhar um link de projeto no WhatsApp e constatar a renderização do card com imagem e descrição via Open Graph.
3. Testar a pontuação no Google Lighthouse e confirmar métricas verdes.

---

## 🧠 Guia de Aprendizado: O que Anotar no seu Diário de Bordo

A cada semana, dedique 30 minutos para responder estas perguntas de arquitetura:
1. **Semana 2:** *Por que o `Slug` foi modelado como Value Object e não como uma simples string? O que aconteceria se a validação de slug ficasse no controller Express?*
2. **Semana 3:** *Se amanhã eu decidir trocar o PostgreSQL pelo MongoDB ou o disco local pelo Cloudflare R2, quais pastas do meu projeto serão alteradas e quais permanecerão 100% intactas?*
3. **Semana 4 & 5:** *Como o `motion.div layout` consegue animar elementos do DOM que mudaram de posição sem que o navegador sofra com gargalos de repintura (layout thrashing)?*
4. **Semana 6:** *Qual é o ganho real de usar a biblioteca Zod tanto no frontend quanto no backend através do `packages/shared`?*

