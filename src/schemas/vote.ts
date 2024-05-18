import { z } from "zod";

export const userVoteRequestSchema = z.object({
    userId: z.number().int().positive("O userId precisa ser um número inteiro positivo"),
    postId: z.number().int().positive("O postId precisa ser um número inteiro positivo"),
    upvote: z.boolean()
});
