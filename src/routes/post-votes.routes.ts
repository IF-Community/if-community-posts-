import { Router, Request, Response } from 'express';

import { PostController } from '../controllers/posts/posts.controller'
const postController = new PostController();

const postWithVotesRoutes = Router();

postWithVotesRoutes.get('/post/v2/posts-with-votes/:offset', async (req: Request, res: Response) => {
    const { offset } = req.params;
    const post = await postController.listWithVotes(+offset);
    return res.status(201).json(post);
});

postWithVotesRoutes.get('/post/v2/list-with-votes/by-user-iD/:userId/:offset', async (req: Request, res: Response) => {
    const { offset,userId } = req.params;
    const post = await postController.listWithVotesByUserID(+userId, +offset);
    return res.status(201).json(post);
});

postWithVotesRoutes.get('/post/v2/list-with-votes/by-total-votes/:offset', async (req: Request, res: Response) => {
    const { offset } = req.params;
    const post = await postController.listWithVotesByTotalVotes(+offset);
    return res.status(201).json(post);
});

export { postWithVotesRoutes };