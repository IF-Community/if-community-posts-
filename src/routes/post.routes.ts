import { Router, Request, Response } from 'express';

import { PostController } from '../controllers/posts/posts.controller'
import { StatusCodes } from 'http-status-codes';
const postController = new PostController();

const postRoutes = Router();

// Initial route
postRoutes.post('/posts', async (req: Request, res: Response) => {
    const { body } = req;
    const post = await postController.create(body);
    return res.status(StatusCodes.CREATED).json(post);
});

postRoutes.get('/posts/:id', async (req: Request, res: Response) => {
    const { id } = req?.params;
    const post = await postController.findOne(+id);
    return res.status(StatusCodes.OK).json(post);
});

postRoutes.get('/posts', async (req: Request, res: Response) => {
    const post = await postController.find();
    return res.status(StatusCodes.OK).json(post);
});

postRoutes.put('/posts/:id', async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req?.params;
    const post = await postController.update(+id, body);
    return res.status(StatusCodes.OK).json(post);
});

postRoutes.delete('/posts/:id', async (req: Request, res: Response) => {
    const { id } = req?.params;
    const post = await postController.remove(+id);
    return res.status(StatusCodes.OK).json(post);
});

export { postRoutes };