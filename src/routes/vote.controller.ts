import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { VoteController } from '../controllers/vote/vote.controller';
import validate from '../middlewares/validation/validationMiddleware';
import { userVoteRequestSchema } from '../schemas';

const votesController = new VoteController();

const votePostRouter = Router();

votePostRouter.post('/votes', validate(userVoteRequestSchema),async (req: Request, res: Response) => {
    const { body } = req;
    const vote = await votesController.create_update(body);
    return res.status(StatusCodes.CREATED).json(vote);
});

votePostRouter.get('/votes', async (req: Request, res: Response) => {
    const { body } = req;
    const vote = await votesController.findOne(body);
    return res.status(StatusCodes.OK).json(vote);
});


votePostRouter.patch('/votes', validate(userVoteRequestSchema),async (req: Request, res: Response) => {
    const { body } = req;
    const vote = await votesController.create_update(body);
    return res.status(StatusCodes.OK).json(vote);
});

votePostRouter.delete('/votes', async (req: Request, res: Response) => {
    const { body } = req;
    const vote = await votesController.remove(body);
    return res.status(StatusCodes.OK).json(vote);
});


export { votePostRouter };