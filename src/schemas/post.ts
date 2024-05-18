import { z } from "zod";

export const postRequestSchema = z.object({
    userId: z.number().int().positive("O userId precisa ser um número inteiro positivo"),
    title: z.string().trim().min(1, "O título é obrigatório e não pode ser vazio"),
    content: z.string().trim().min(1, "O conteúdo é obrigatório e não pode ser vazio"),
    categories: z.array(
        z.object({
            name: z.string().trim().min(1, "O nome da categoria é obrigatório e não pode ser vazio"),
            remove: z.boolean().optional()
        })
    ).optional()
});


export const tagsSchema = z.object({
    tags: z.array(
      z.string().trim().min(1, "Cada tag deve ser uma string não vazia")
    )
});