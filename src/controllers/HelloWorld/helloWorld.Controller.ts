import { Request, Response } from 'express';

export const helloWorldController = async (req: Request, res: Response) => {
    return res.json({ msg: 'Olá, DEV!' });
}