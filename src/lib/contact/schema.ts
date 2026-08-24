import { z } from "zod";

/**
 * Validação da mensagem de contato. Roda no SERVIDOR — o formulário no
 * cliente é conveniência, não barreira: qualquer um pode fazer POST
 * direto no route handler.
 *
 * `website` é o honeypot: campo invisível para gente, preenchido por
 * robô que despeja valor em todo input do formulário. Tem de vir vazio.
 */
export const contactSchema = z.strictObject({
  name: z.string().trim().min(2, "nome muito curto").max(80),
  email: z.email("e-mail inválido").max(160),
  message: z.string().trim().min(20, "mensagem muito curta").max(2000),
  website: z.string().max(0, "honeypot preenchido").optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
