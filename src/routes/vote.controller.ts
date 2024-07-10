import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { VoteServices } from '../services/vote/vote.services';
import validate from '../middlewares/validation/validationMiddleware';
import { userVoteRequestSchema } from '../schemas';
import authenticate from '../middlewares/authenticate/authenticate';
import { ApiError } from '../helpers/api-error';

const voteServices = new VoteServices();

const votePostRouter = Router();

votePostRouter.post('/votes', authenticate ,async (req: Request, res: Response) => {
    
    /*
        #swagger.tags = ['Votes (Upvotes)']
        #swagger.description = 'adding interation(upvote) user to microservice'

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'vote data',
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
    const vote = await voteServices.create_update(body);
    return res.status(StatusCodes.CREATED).json(vote);
});

votePostRouter.get('/votes', authenticate, async (req: Request, res: Response) => {
    
    /*
        #swagger.tags = ['Votes (Upvotes)']
        #swagger.description = 'search for a user by ID and a post ID'

        #swagger.parameters['userId'] = {
            in: 'query',
            required: true,
            type: 'number'
        }

        #swagger.parameters['postId'] = {
            in: 'query',
            required: true,
            type: 'number'
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

    const { userId, postId } = req.query;

    if (!userId || !postId) {
        throw new ApiError('Você precisa informar a query de userId e postId', StatusCodes.BAD_REQUEST);
    }
    
    const userIdNumber = Number(userId);
    const postIdNumber = Number(postId);
    
    if (isNaN(userIdNumber) || isNaN(postIdNumber)) {
        throw new ApiError('userId e postId precisam ser números válidos', StatusCodes.BAD_REQUEST);
    }
    
    const searchData = {
        userId: userIdNumber,
        postId: postIdNumber,
    };

    const vote = await voteServices.findOne(searchData);
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
    const vote = await voteServices.create_update(body);
    return res.status(StatusCodes.OK).json(vote);
});

votePostRouter.delete('/votes', authenticate, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Votes (Upvotes)']
        #swagger.description = 'removes a vote from the specified user id and post id'
        
        #swagger.parameters['userId'] = {
            in: 'query',
            required: true,
            type: 'number'
        }

        #swagger.parameters['postId'] = {
            in: 'query',
            required: true,
            type: 'number'
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

    const { userId, postId } = req.query;

    if (!userId || !postId) {
        throw new ApiError('Você precisa informar a query de userId e postId', StatusCodes.BAD_REQUEST);
    }
    
    const userIdNumber = Number(userId);
    const postIdNumber = Number(postId);
    
    if (isNaN(userIdNumber) || isNaN(postIdNumber)) {
        throw new ApiError('userId e postId precisam ser números válidos', StatusCodes.BAD_REQUEST);
    }
    
    const searchData = {
        userId: userIdNumber,
        postId: postIdNumber,
    };

    const vote = await voteServices.remove(searchData);
    return res.status(StatusCodes.OK).json(vote);
});

export { votePostRouter };