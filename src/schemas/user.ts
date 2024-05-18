import { z } from "zod";

export const requestUserSchema = z.object({
    id: z.number().int().positive("O ID precisa ser um número inteiro positivo"),
    name: z.string().trim().min(1, "O nome é obrigatório e não pode ser vazio")
});

export const requestUserUpdateSchema = z.object({
    name: z.string().trim().min(1, "O nome é obrigatório e não pode ser vazio")
});