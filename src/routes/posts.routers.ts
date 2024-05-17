import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PostController } from '../controllers/posts/posts.controller';

const postRouter = Router();
const postController = new PostController();

postRouter.post('/posts', async (req: Request, res: Response) => {
    const { body } = req;
    const newPost = await postController.create(body);
    return res.status(StatusCodes.CREATED).json(newPost);
});


postRouter.get('/posts/categories', async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.pageNumber as string) || 1;
    const pageSize = Number(req.query.pageSize as string) || 10;

    const { tags } = req.body;

    const posts = await postController.findByCategories(tags, pageNumber, pageSize);
    return res.status(StatusCodes.OK).json(posts);
});

postRouter.get('/posts/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const posts = await postController.findOne(+id);
    return res.status(StatusCodes.OK).json(posts);
});

postRouter.get('/posts/users/:id', async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.pageNumber as string) || 1;
    const pageSize = Number(req.query.pageSize as string) || 10;

    const { id } = req.params;

    const posts = await postController.findByUser(+id, pageNumber, pageSize);
    return res.status(StatusCodes.OK).json(posts);
});


postRouter.get('/posts', async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.pageNumber as string) || 1;
    const pageSize = Number(req.query.pageSize as string) || 10;
    const popularity = req.query.popularity === 'true';


    const posts = await postController.find(pageNumber, pageSize, popularity);
    return res.status(StatusCodes.OK).json(posts);
});

postRouter.patch('/posts/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    const  post = await postController.update(+id, body);
    return res.status(StatusCodes.OK).json(post);
});

postRouter.delete('/posts/:id', async (req: Request, res: Response) => {
    const { id } = req?.params;
    const post = await postController.remove(+id);
    return res.status(StatusCodes.OK).json(post);
});

export { postRouter };