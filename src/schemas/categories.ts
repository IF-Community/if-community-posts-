import { z } from "zod";

export const categoryRequestSchema = z.object({
    name: z.string().trim().min(1, "O nome é obrigatório e não pode ser vazio")
});