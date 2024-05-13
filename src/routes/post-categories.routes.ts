import { Router, Request, Response } from 'express';

import { PostController } from '../controllers/posts/posts.controller'
const postController = new PostController();

const postCategoriesRoutes = Router();

postCategoriesRoutes.post('/add-post-category', async (req: Request, res: Response) => {
    const { body } = req;
    const post = await postController.addPostCategory(body);
    return res.status(201).json(post);
});

postCategoriesRoutes.delete('/remove-post-category/:categoryId', async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const post = await postController.removePostCategory(+categoryId);
    return res.status(201).json(post);
});


export { postCategoriesRoutes };