import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const helloWorldController = async (req: Request, res: Response) => {
    return res.status(StatusCodes.OK).json({ msg: 'Olá, DEV!' });
}