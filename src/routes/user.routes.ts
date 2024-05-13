import { Router, Request, Response } from 'express';

import { UsersController } from '../controllers/users/users.controller'
import { StatusCodes } from 'http-status-codes';
const userController = new UsersController();

const userRoutes = Router();


userRoutes.post('/users', async (req: Request, res: Response) => {
    const { body } = req;
    const user = await userController.create(body);
    return res.status(StatusCodes.CREATED).json(body);
});

userRoutes.get('/users', async (req: Request, res: Response) => {
    const user = await userController.find();
    return res.status(StatusCodes.OK).json(user);
});

userRoutes.get('/users/:id', async (req: Request, res: Response) => {
    const { id } = req?.params;
    const user = await userController.findOne(+id);
    return res.status(StatusCodes.OK).json(user);
});

userRoutes.put('/users/:id', async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req?.params;
    const user = await userController.update(+id, body);
    return res.status(StatusCodes.CREATED).json(user);
});

userRoutes.delete('/users/:id', async (req: Request, res: Response) => {
    const { id } = req?.params;
    const user = await userController.remove(+id);
    return res.status(StatusCodes.OK).json(user);
});

export { userRoutes };