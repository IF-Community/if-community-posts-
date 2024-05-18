import { Router, Request, Response } from 'express';
import { CategorieController } from '../controllers/categories/categories.controllers';
import { StatusCodes } from 'http-status-codes';
import validate from '../middlewares/validation/validationMiddleware';
import { categoryRequestSchema } from '../schemas';

const categoryRouter = Router();

const categoryController = new CategorieController();

categoryRouter.post('/categories', validate(categoryRequestSchema), async (req: Request, res: Response) => {
    const { body } = req;
    const newCategory = await categoryController.create(body);
    return res.status(StatusCodes.CREATED).json(newCategory);
});

categoryRouter.get('/categories', async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const categorys = await categoryController.find(pageNumber, pageSize);
    return res.status(StatusCodes.OK).json(categorys);
});

categoryRouter.get('/categories/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryController.findOne(+id);
    return res.status(StatusCodes.OK).json(category);
});

categoryRouter.patch('/categories/:id', validate(categoryRequestSchema),async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    const category = await categoryController.update(+id, body);
    return res.status(StatusCodes.OK).json(category);
});

categoryRouter.delete('/categories/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryController.remove(+id);
    return res.status(StatusCodes.OK).json(category);
});



export { categoryRouter };