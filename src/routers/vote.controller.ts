import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { VoteController } from '../controllers/vote/vote.controller';

const votesController = new VoteController();

const votePostRouter = Router();

votePostRouter.post('/votes', async (req: Request, res: Response) => {
    const { body } = req;
    const vote = await votesController.create(body);
    return res.status(StatusCodes.CREATED).json(vote);
});

votePostRouter.get('/votes', async (req: Request, res: Response) => {
    const { body } = req;
    const vote = await votesController.findOne(body);
    return res.status(StatusCodes.OK).json(vote);
});


votePostRouter.patch('/votes', async (req: Request, res: Response) => {
    const { body } = req;
    const vote = await votesController.update(body);
    return res.status(201).json(vote);
});

votePostRouter.delete('/votes', async (req: Request, res: Response) => {
    const { body } = req;
    const vote = await votesController.remove(body);
    return res.status(201).json(vote);
});


export { votePostRouter };