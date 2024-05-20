import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { VoteController } from '../controllers/vote/vote.controller';
import validate from '../middlewares/validation/validationMiddleware';
import { userVoteRequestSchema } from '../schemas';
import authenticate from '../middlewares/authenticate/authenticate';

const votesController = new VoteController();

const votePostRouter = Router();

votePostRouter.post('/votes', authenticate, validate(userVoteRequestSchema),async (req: Request, res: Response) => {
    
    /*
        #swagger.tags = ['Votes (Upvotes)']
        #swagger.description = 'adding interation(upvote) user to microservice'

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'User data.',
            required: true,
            schema: {
                "userId": 1,
                "postId": 1,
                "upvote": true
            }
        }

        #swagger.responses[201] = {
            schema: { 
                "userId": 1,
                "postId": 1,
                "upvote": true,
                "updatedAt": "null",
                "id": 1,
                "createdAt": "2024-05-20T00:20:37.690Z",
                "deletedAt": "null"
            }
        }

        #swagger.responses[500] = {
            schema: { 
                message: "Internal Server Error"
            }
        }

        #swagger.responses[400] = {
            schema: { 
                errors: "(error message) no (parameter)"
            }
        }

        #swagger.responses[401] = {
            schema: { 
                message: "Token inválido. Forneça um token de autenticação válido."
            }
        }

        #swagger.security = [{
            "apiKeyAuth": []
        }] 
    */

    const { body } = req;
    const vote = await votesController.create_update(body);
    return res.status(StatusCodes.CREATED).json(vote);
});

votePostRouter.get('/votes', authenticate, async (req: Request, res: Response) => {
    
    /*
        #swagger.tags = ['Votes (Upvotes)']
        #swagger.description = 'search for a user by ID and a post ID'

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'User data.',
            required: true,
            schema: {
                "userId": 1,
		        "postId": 1
            }
        }


        #swagger.responses[200] = {
            schema: { 
                "id": 6,
                "createdAt": "2024-05-16T12:39:10.306Z",
                "updatedAt": "null",
                "deletedAt": "null",
                "upvote": true,
                "userId": "1",
                "postId": "1"
            }
        }

        #swagger.responses[404] = {
            schema: { 
                message: "voto não encontrado no sistema"
            }
        }

        #swagger.responses[500] = {
            schema: { 
                message: "Internal Server Error"
            }
        }

        #swagger.responses[400] = {
            schema: { 
                errors: "(error message) no (parameter)"
            }
        }

        #swagger.responses[401] = {
            schema: { 
                message: "Token inválido. Forneça um token de autenticação válido."
            }
        }

        #swagger.security = [{
            "apiKeyAuth": []
        }]   
    
    */

    const { body } = req;
    const vote = await votesController.findOne(body);
    return res.status(StatusCodes.OK).json(vote);
});


votePostRouter.patch('/votes', authenticate, validate(userVoteRequestSchema),async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Votes (Upvotes)']
        #swagger.description = 'adding interation(upvote) user to microservice'

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'User data.',
            required: true,
            schema: {
                "userId": 1,
                "postId": 1,
                "upvote": true
            }
        }

        #swagger.responses[200] = {
            schema: { 
                "id": 6,
                "createdAt": "2024-05-16T12:39:10.306Z",
                "updatedAt": "2024-05-16T12:40:27.328Z",
                "deletedAt": "null",
                "upvote": false,
                "userId": "1",
                "postId": "1"
            }
        }

        #swagger.responses[500] = {
            schema: { 
                message: "Internal Server Error"
            }
        }

        #swagger.responses[400] = {
            schema: { 
                errors: "(error message) no (parameter)"
            }
        }

        #swagger.responses[401] = {
            schema: { 
                message: "Token inválido. Forneça um token de autenticação válido."
            }
        }

        #swagger.security = [{
            "apiKeyAuth": []
        }] 
    */

    const { body } = req;
    const vote = await votesController.create_update(body);
    return res.status(StatusCodes.OK).json(vote);
});

votePostRouter.delete('/votes', authenticate, async (req: Request, res: Response) => {
    /*
        // #swagger.tags = ['Votes (Upvotes)']
        #swagger.description = 'removes a vote from the specified user id and post id'
        
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'User data.',
            required: true,
            schema: {
                "userId": 1,
                "postId": 1,
            }
        }

        #swagger.responses[200] = {
            schema: { 
                delete: true
            }
        }

        #swagger.responses[404] = {
            schema: { 
                message: "voto não encontrado no sistema"
            }
        }

        #swagger.responses[500] = {
            schema: { 
                message: "Internal Server Error"
            }
        }

        #swagger.responses[400] = {
            schema: { 
                errors: "(error message) no (parameter)"
            }
        }

        #swagger.responses[401] = {
            schema: { 
                message: "Token inválido. Forneça um token de autenticação válido."
            }
        }

        #swagger.security = [{
            "apiKeyAuth": []
        }] 

    */

    const { body } = req;
    const vote = await votesController.remove(body);
    return res.status(StatusCodes.OK).json(vote);
});


export { votePostRouter };