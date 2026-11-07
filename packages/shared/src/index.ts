import { z } from "zod";

// ==========================================
// Semana 1: Healthcheck
// ==========================================
export const HealthCheckResponseSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string().datetime(),
  environment: z.string(),
  database: z.enum(["connected", "disconnected", "mock"]),
  version: z.string().default("0.1.0")
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

// ==========================================
// Contratos de Portfólio (Fundação)
// ==========================================
export const ImagemDTOSchema = z.object({
  id: z.string().uuid(),
  chave: z.string(),
  alt: z.string(),
  ordem: z.number().int().min(1),
  capa: z.boolean()
});
export type ImagemDTO = z.infer<typeof ImagemDTOSchema>;

export const CategoriaDTOSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  slug: z.string()
});
export type CategoriaDTO = z.infer<typeof CategoriaDTOSchema>;

export const ProjetoDTOSchema = z.object({
  id: z.string().uuid(),
  titulo: z.string(),
  slug: z.string(),
  descricao: z.string(),
  categoriaId: z.string().uuid(),
  categoriaNome: z.string(),
  categoriaSlug: z.string(),
  ano: z.number().int().optional(),
  materiais: z.array(z.string()),
  destaque: z.boolean(),
  publicado: z.boolean(),
  imagens: z.array(ImagemDTOSchema),
  criadoEm: z.string(),
  atualizadoEm: z.string()
});
export type ProjetoDTO = z.infer<typeof ProjetoDTOSchema>;

// ==========================================
// Contratos de Orçamento / Contato
// ==========================================
export const SolicitacaoOrcamentoInputSchema = z.object({
  nome: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().optional(),
  tipoProjeto: z.string().optional(),
  mensagem: z.string().min(10, "A mensagem deve ter no mínimo 10 caracteres").max(2000, "A mensagem pode ter no máximo 2000 caracteres"),
  website: z.string().max(0, "Spam detectado").optional() // Honeypot field
});
export type SolicitacaoOrcamentoInput = z.infer<typeof SolicitacaoOrcamentoInputSchema>;
