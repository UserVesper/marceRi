# marceRI

Site de portfólio para divulgar o trabalho de um marceneiro.

Pequeno como produto, mas construído como exercício de arquitetura: frontend e backend separados, e backend com **Arquitetura Hexagonal + DDD + Clean Architecture**.

---

## 1. Objetivos

- **Produto:** mostrar os trabalhos do marceneiro e facilitar o pedido de orçamento.
- **Estudo:** aplicar de verdade hexagonal, DDD e Clean Architecture, sem criar abstração que não se paga. Onde o domínio é simples (ex.: categorias), manter simples.
- **Fora de escopo:** alta escala, multiusuário, e-commerce, pagamentos.

## 2. Escopo

**MVP**
- Site público: Home, Portfólio (filtro por categoria), Detalhe do projeto, Sobre, Contato/orçamento (formulário + botão de WhatsApp).
- API: leitura pública de projetos e recebimento de solicitações de contato.
- Cadastro de conteúdo feito pelo desenvolvedor, via API protegida por chave (e, opcionalmente, uma CLI). **Sem tela de admin.**

**Pós-MVP**
- Painel admin no frontend, com login, para o marceneiro editar sozinho.
- Contexto de Identidade (usuário admin, JWT em cookie httpOnly).
- Storage de imagens em nuvem (R2/S3).

## 3. Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS (sem Bootstrap), React Router, TanStack Query, React Hook Form + Zod |
| Backend | Node.js + TypeScript + Express 5, Zod na borda HTTP |
| Banco | PostgreSQL + Drizzle ORM (drizzle-kit para migrations) |
| Imagens | multer (upload) + sharp (redimensionar, WebP) |
| Testes | Vitest, Supertest, Testcontainers, Testing Library |
| Infra | Docker Compose, GitHub Actions, Caddy |
| Monorepo | pnpm workspaces |

## 4. Estrutura do repositório

```
marceRI/
├─ apps/
│  ├─ web/             # React
│  └─ api/             # Node + Express
├─ packages/
│  └─ shared/          # schemas Zod e tipos do contrato da API
├─ docker-compose.yml  # Postgres local
├─ pnpm-workspace.yaml
└─ README.md
```

O pacote `shared` evita duplicar validação e tipos entre front e back.

## 5. Domínio (DDD)

Linguagem ubíqua em **português** no domínio e nos casos de uso (`Projeto`, `Imagem`, `SolicitacaoOrcamento`). Termos técnicos (Repository, Controller) ficam em inglês.

### Contextos

| Contexto | Conteúdo |
|---|---|
| **Portfólio** | `Projeto` (raiz) com `Imagem`; `Categoria` |
| **Contato** | `SolicitacaoOrcamento` |
| **Identidade** | `UsuarioAdmin` (pós-MVP) |

### Regras (invariantes)

**Projeto**
- Slug gerado a partir do título, único, em minúsculas e com hífens.
- Só pode ser publicado se tiver categoria e pelo menos 1 imagem.
- No máximo uma imagem de capa; se nenhuma for definida, a primeira é a capa.
- A ordem das imagens é contínua (1..n) e reordenável.

**Categoria**
- Nome e slug únicos.

**SolicitacaoOrcamento**
- E-mail válido; mensagem entre 10 e 2000 caracteres.
- Status: `nova → respondida → arquivada` (também `nova → arquivada`).

**Value objects:** `Slug`, `Email`, `Telefone`, `StatusSolicitacao`.

## 6. Arquitetura do backend

Regra de dependência: tudo aponta para dentro. O domínio não importa framework, ORM nem HTTP.

```
interface/http ──┐
infrastructure ──┴──► application ──► domain
```

| Camada | Responsabilidade |
|---|---|
| `domain` | Entidades, value objects, erros de domínio |
| `application` | Casos de uso e **portas** (interfaces) |
| `infrastructure` | Adaptadores de saída: repositórios Postgres, storage de imagens, notificador |
| `interface` | Adaptadores de entrada: rotas Express, controllers, schemas Zod (e, opcionalmente, CLI) |

### Estrutura de pastas

```
apps/api/src/
├─ modules/
│  ├─ portfolio/
│  │  ├─ domain/            # Projeto, Imagem, Categoria, Slug, erros
│  │  ├─ application/
│  │  │  ├─ use-cases/
│  │  │  └─ ports/          # ProjetoRepository, CategoriaRepository, ImageStorage
│  │  ├─ infrastructure/    # repositórios Drizzle, LocalDiskImageStorage
│  │  └─ interface/http/    # rotas, controllers, schemas Zod
│  └─ contato/              # mesma estrutura
├─ shared/                  # DomainError, Clock, utilitários
└─ main/                    # composition root, app Express, server.ts
```

### Portas

- **Entrada (driving):** rotas HTTP e, opcionalmente, uma CLI de cadastro. Os dois chamam os mesmos casos de uso, o que mostra bem o valor da arquitetura.
- **Saída (driven):** `ProjetoRepository`, `CategoriaRepository`, `SolicitacaoRepository`, `ImageStorage`, `Notificador`, `Clock`.

### Decisões de implementação

- Caso de uso = classe com `execute(input)`; dependências injetadas pelo construtor.
- Injeção de dependência **manual** no composition root (`main/`), sem container.
- Erros de domínio tipados (`NaoEncontrado`, `Conflito`, `RegraViolada`), mapeados por **um único error handler** do Express (404, 409, 422).
- IDs gerados na aplicação (`crypto.randomUUID()`), não pelo banco.
- Zod só na borda HTTP; o domínio valida as próprias invariantes sem depender dele.
- Listagens públicas usam uma porta de consulta que devolve DTOs direto, sem montar o agregado inteiro.
- Autenticação no MVP: header `x-api-key` comparado com `ADMIN_API_KEY` (usar `crypto.timingSafeEqual`).

## 7. Casos de uso

**Portfólio, público**
- `ListarProjetosPublicados` (filtros: categoria, destaque)
- `ObterProjetoPublicadoPorSlug`
- `ListarCategorias`

**Portfólio, gestão**
- `CriarCategoria`, `CriarProjeto`, `AtualizarProjeto`, `ExcluirProjeto`
- `AdicionarImagem`, `RemoverImagem`, `DefinirCapa`, `ReordenarImagens`
- `PublicarProjeto`, `DespublicarProjeto`

**Contato**
- `EnviarSolicitacao` (público)
- `ListarSolicitacoes`, `AtualizarStatusSolicitacao` (gestão)

## 8. API REST

**Pública**

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/categorias` | Lista categorias |
| GET | `/api/projetos` | Lista projetos publicados (`?categoria=slug&destaque=true`) |
| GET | `/api/projetos/:slug` | Detalhe com imagens |
| POST | `/api/solicitacoes` | Envia pedido de orçamento (rate limit + campo honeypot) |

**Gestão** (exige header `x-api-key`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/admin/projetos` | Lista todos, inclusive rascunhos |
| POST | `/api/admin/projetos` | Cria projeto |
| PUT | `/api/admin/projetos/:id` | Atualiza projeto |
| DELETE | `/api/admin/projetos/:id` | Exclui projeto |
| POST | `/api/admin/projetos/:id/publicar` | Publica (`/despublicar` desfaz) |
| POST | `/api/admin/projetos/:id/imagens` | Upload (multipart) |
| PUT | `/api/admin/projetos/:id/imagens/ordem` | Reordena |
| PUT | `/api/admin/projetos/:id/imagens/:imagemId/capa` | Define capa |
| DELETE | `/api/admin/projetos/:id/imagens/:imagemId` | Remove imagem |
| POST | `/api/admin/categorias` | Cria categoria |
| GET | `/api/admin/solicitacoes` | Lista solicitações |
| PATCH | `/api/admin/solicitacoes/:id` | Altera status |

## 9. Banco de dados (referência)

As migrations serão geradas a partir do schema Drizzle; o SQL abaixo é a referência do modelo.

```sql
create table categorias (
  id   uuid primary key,
  nome text not null unique,
  slug text not null unique
);

create table projetos (
  id            uuid primary key,
  titulo        text not null,
  slug          text not null unique,
  descricao     text not null default '',
  categoria_id  uuid not null references categorias(id),
  ano           smallint,
  materiais     text[] not null default '{}',
  destaque      boolean not null default false,
  publicado     boolean not null default false,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table imagens_projeto (
  id         uuid primary key,
  projeto_id uuid not null references projetos(id) on delete cascade,
  chave      text not null,           -- identificador no storage, não a URL
  alt        text not null default '',
  ordem      smallint not null,
  capa       boolean not null default false
);
create unique index imagens_uma_capa_por_projeto
  on imagens_projeto (projeto_id) where capa;

create table solicitacoes_orcamento (
  id           uuid primary key,
  nome         text not null,
  email        text not null,
  telefone     text,
  tipo_projeto text,
  mensagem     text not null,
  status       text not null default 'nova'
               check (status in ('nova','respondida','arquivada')),
  criada_em    timestamptz not null default now()
);
```

## 10. Imagens

1. Upload via multer (memória), limite de 10 MB, apenas JPEG/PNG/WebP.
2. `sharp` gera variantes em WebP (ex.: 480, 960 e 1600 px de largura).
3. A porta `ImageStorage` grava e devolve uma **chave**; a URL é montada pelo adaptador.
4. MVP: `LocalDiskImageStorage` (pasta `uploads/`, servida com `express.static` e cache longo).
5. Depois: trocar por um adaptador R2/S3 sem tocar em domínio nem casos de uso.

## 11. Frontend

**Rotas:** `/`, `/portfolio`, `/portfolio/:slug`, `/sobre`, `/contato`, e uma 404.

**Organização por feature:**

```
apps/web/src/
├─ features/
│  ├─ portfolio/    # páginas, componentes, hooks de API
│  └─ contato/
├─ shared/
│  ├─ ui/           # Button, Input, Gallery, Lightbox (Tailwind)
│  └─ api/          # cliente HTTP tipado com packages/shared
└─ routes/
```

**Pontos de atenção**
- Mobile-first; a maior parte do público virá do celular.
- Estados de carregamento, erro e lista vazia em toda tela com dados.
- Imagens: `loading="lazy"`, `srcset` com as variantes WebP, dimensões fixas para evitar salto de layout.
- Acessibilidade: `alt` nas fotos, foco visível, navegação por teclado no lightbox.
- SEO (importante para um site de divulgação): React 19 aceita `<title>` e `<meta>` direto nos componentes; adicionar `sitemap.xml`, Open Graph e dados estruturados `LocalBusiness`.
- Tailwind: definir paleta e tipografia como tokens no tema (tons de madeira) antes de montar as telas.

## 12. Testes

| O quê | Como |
|---|---|
| Domínio e casos de uso | Vitest, com repositórios em memória (rápidos, sem infra) |
| Repositórios Postgres | Integração com Testcontainers |
| Rotas da API | Supertest nas rotas principais |
| Frontend | Testing Library no formulário de contato e na galeria |

## 13. Roadmap

**Fase 0: conteúdo e design**
- [ ] Reunir fotos dos melhores projetos (6 a 10) e textos básicos
- [ ] Definir categorias, paleta e tipografia
- [ ] Wireframes simples das 5 telas

**Fase 1: setup**
- [ ] Repositório, pnpm workspaces, tsconfig base, ESLint + Prettier
- [ ] `docker-compose.yml` com Postgres
- [ ] CI (lint + testes) no GitHub Actions
- [ ] `.gitattributes` para padronizar fim de linha (Windows)

**Fase 2: domínio e casos de uso (Portfólio)**
- [ ] Entidades, value objects e erros de domínio
- [ ] Portas (interfaces)
- [ ] Casos de uso com repositórios em memória
- [ ] Testes unitários

**Fase 3: adaptadores do Portfólio**
- [ ] Schema Drizzle + migrations + seed de categorias
- [ ] Repositórios Postgres + testes de integração
- [ ] `LocalDiskImageStorage` + sharp
- [ ] Rotas Express, middleware de API key, error handler
- [ ] Composition root

**Fase 4: Contato**
- [ ] Domínio, casos de uso, repositório, rota
- [ ] Rate limit + honeypot
- [ ] Adaptador `Notificador` (e-mail via SMTP, ou log no começo)

**Fase 5: frontend público**
- [ ] Vite + Tailwind, layout base, cliente de API tipado
- [ ] Home, Portfólio, Detalhe (galeria + lightbox), Sobre, Contato
- [ ] Responsividade, estados de loading/erro/vazio

**Fase 6: conteúdo real, polimento e deploy**
- [ ] Cadastrar os projetos reais (REST client ou CLI)
- [ ] SEO (meta tags, sitemap, Open Graph) e avaliar pré-renderização
- [ ] Lighthouse e acessibilidade
- [ ] Deploy, domínio e backups

**Pós-MVP**
- [ ] Contexto Identidade + login admin (JWT em cookie httpOnly)
- [ ] Painel admin no frontend
- [ ] Storage em nuvem

## 14. Deploy e operação

**Opção recomendada:** VPS pequena com Docker Compose rodando `api`, `postgres` e `caddy`. O Caddy serve o build estático do `web`, faz proxy de `/api` para a API e cuida do HTTPS automático.

**Alternativa:** PaaS (Render, Railway ou Fly) com Postgres gerenciado; nesse caso, usar R2/S3 para as imagens, já que o disco costuma ser efêmero.

**Backups:** `pg_dump` diário e cópia do volume de uploads. Imagens em disco são dados que não dá para regenerar.

## 15. Configuração local

Variáveis de ambiente (`.env`):

```
PORT=3333
DATABASE_URL=postgres://marceri:marceri@localhost:5432/marceri
ADMIN_API_KEY=troque-por-um-valor-longo-e-aleatorio
UPLOAD_DIR=./uploads
PUBLIC_BASE_URL=http://localhost:3333
CORS_ORIGIN=http://localhost:5173
```

Comandos previstos:

```
copy .env.example .env
docker compose up -d db
pnpm install
pnpm --filter api db:migrate
pnpm dev          # sobe api e web
pnpm test
```

## 16. Decisões em aberto

- **Pré-renderização das páginas públicas:** SPA pura é fraca em SEO. Avaliar `vite-react-ssg` (confirmar manutenção antes de adotar) ou decidir que meta tags + sitemap bastam para o volume do site.
- **CLI de cadastro:** vale se o cadastro por REST client ficar trabalhoso; é também um bom exemplo de segundo adaptador de entrada.
- **Idioma do código:** domínio em português (definido acima); revisar se preferir tudo em inglês.
