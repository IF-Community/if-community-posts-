import { Router, Request, Response } from 'express';

import { PostController } from '../controllers/posts/posts.controller'
const postController = new PostController();

const postRoutes = Router();

// Initial route
postRoutes.post('/posts', async (req: Request, res: Response) => {
    const { body } = req;
    const post = await postController.create(body);
    return res.status(201).json(post);
});

postRoutes.get('/posts/:id', async (req: Request, res: Response) => {
    const { id } = req?.params;
    const post = await postController.findOne(+id);
    return res.status(201).json(post);
});

postRoutes.get('/posts', async (req: Request, res: Response) => {
    const post = await postController.find();
    return res.status(201).json(post);
});

postRoutes.put('/posts/:id', async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req?.params;
    const post = await postController.update(+id, body);
    return res.status(201).json(post);
});

postRoutes.delete('/posts/:id', async (req: Request, res: Response) => {
    const { id } = req?.params;
    const post = await postController.remove(+id);
    return res.status(201).json(post);
});

export { postRoutes };