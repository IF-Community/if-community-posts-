import { Router, Request, Response } from 'express';

import { CategorieController } from '../controllers/categories/categorie.controller'
import { StatusCodes } from 'http-status-codes';

const categoriesController = new CategorieController();

const categoriesRoutes = Router();


categoriesRoutes.post('/categories', async (req: Request, res: Response) => {
    const { body } = req;
  
    const category = await categoriesController.create(body);
    return res.status(StatusCodes.CREATED).json(category);
});


categoriesRoutes.get('/categories', async (req: Request, res: Response) => {
    const category = await categoriesController.find();
    return res.status(StatusCodes.OK).json(category);
});

categoriesRoutes.get('/categories/:id', async (req: Request, res: Response) => {
    const { id } = req?.params;
    const category = await categoriesController.findOne(+id);
    return res.status(StatusCodes.OK).json(category);
});

categoriesRoutes.put('/categories/:id', async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req?.params;
    const category = await categoriesController.update(+id, body);
    return res.status(StatusCodes.CREATED).json(category);
});

categoriesRoutes.delete('/categories/:id', async (req: Request, res: Response) => {
    const { id } = req?.params;
    const category = await categoriesController.remove(+id);
    return res.status(StatusCodes.OK).json(category);
});

export { categoriesRoutes };