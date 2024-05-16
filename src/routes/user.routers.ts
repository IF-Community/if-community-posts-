import { Router, Request, Response } from 'express';
import UsersController from "../controllers/users/users.controller";
import { StatusCodes } from 'http-status-codes';

const userRouter = Router();

const userController = new UsersController();

userRouter.post('/users', async (req: Request, res: Response) => {
    const { body } = req;
    const newUser = await userController.create(body);
    return res.status(StatusCodes.CREATED).json(newUser);
});

userRouter.get('/users', async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const users = await userController.find(pageNumber, pageSize);
    return res.status(StatusCodes.OK).json(users);
});

userRouter.get('/users/:communitId', async (req: Request, res: Response) => {
    const { communitId } = req.params;
    const user = await userController.findOne(+communitId);
    return res.status(StatusCodes.OK).json(user);
});

userRouter.patch('/users/:communitId', async (req: Request, res: Response) => {
    const { communitId } = req.params;
    const { body } = req;
    const user = await userController.update(+communitId, body);
    return res.status(StatusCodes.OK).json(user);
});

userRouter.delete('/users/:communitId', async (req: Request, res: Response) => {
    const { communitId } = req.params;
    const user = await userController.remove(+communitId);
    return res.status(StatusCodes.OK).json(user);
});

export { userRouter };