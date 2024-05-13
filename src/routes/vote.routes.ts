import { Router, Request, Response } from 'express';

import { VoteController } from '../controllers/votes/vote.controller'
const votesController = new VoteController();

const votePost = Router();

// Initial route
votePost.post('/votes', async (req: Request, res: Response) => {
    const { body } = req;
    const vote = await votesController.create(body);
    return res.status(201).json(vote);
});

votePost.get('/votes/:id', async (req: Request, res: Response) => {
    const { id } = req?.params;
    const vote = await votesController.findOne(+id);
    return res.status(201).json(vote);
});

votePost.get('/votes', async (req: Request, res: Response) => {
    const vote = await votesController.find();
    return res.status(201).json(vote);
});

votePost.put('/votes/:id', async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req?.params;
    const vote = await votesController.update(+id, body);
    return res.status(201).json(vote);
});

votePost.delete('/votes/:id', async (req: Request, res: Response) => {
    const { id } = req?.params;
    const vote = await votesController.remove(+id);
    return res.status(201).json(vote);
});


export { votePost };