import { Router, Request, Response } from 'express';
import UsersServices from "../services/users/users.services";
import { StatusCodes } from 'http-status-codes';
import validate from '../middlewares/validation/validationMiddleware';
import { requestUserSchema, requestUserUpdateSchema } from '../schemas';
import authenticate from '../middlewares/authenticate/authenticate';

const userRouter = Router();

const usersServices = new UsersServices();


userRouter.post('/posts/users', authenticate,validate(requestUserSchema) ,async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Users']
        #swagger.description = 'adding new user to microservice' 

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'User data.',
            required: true,
            schema: {
                id: 1,
                name: "joão da silva"
            }
        }

        #swagger.responses[201] = {
            schema: { 
                id: 5,
                name: "joão da silva",
                updatedAt: "null",
                createdAt: "2024-05-19T11:11:43.799Z",
                deletedAt: "null"
            }
        }

        #swagger.responses[409] = {
            schema: { 
                message: "Um usuário com esse id já está cadastrado no sistema"
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
    const newUser = await usersServices.create(body);
    return res.status(StatusCodes.CREATED).json(newUser);
});

userRouter.get('/posts/users', authenticate,async (req: Request, res: Response) => {
    /* 
        #swagger.tags = ['Users']
        #swagger.description = 'lists all users registered in the system'

        #swagger.responses[200] = {
            schema: { 
                "totalPages": 1,
                "results": [
                    {
                        "id": 2,
                        "name": "maria da silva",
                        "createdAt": "2024-05-19T11:11:43.799Z",
                        "updatedAt": "null",
                        "deletedAt": "null"
                    },
                ]
            }
        }


        #swagger.responses[500] = {
            schema: { 
                message: "Internal Server Error"
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


        #swagger.parameters['pageNumber'] = {
            in: 'query',
            description: 'Number informing which page the search should return\n (pattern 1)',
            type: 'number'
        }

        #swagger.parameters['pageSize'] = {
            in: 'query',
            description: 'Number informing the number of elements per page\n (pattern 10)',
            type: 'number'
        } 

    */
    
    const pageNumber = Number(req.query.pageNumber) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const users = await usersServices.find(pageNumber, pageSize);
    return res.status(StatusCodes.OK).json(users);
});

userRouter.get('/posts/users/:id', authenticate,async (req: Request, res: Response) => {
    /*  
        #swagger.tags = ['Users']
        #swagger.description = 'search for a user by ID' 

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The user ID that was registered in the system',
            type: 'number'
        }

        #swagger.responses[404] = {
            schema: { 
                message: "Um usuário com esse id não está cadastrado no sistema"
            }
        }


        #swagger.responses[500] = {
            schema: { 
                message: "Internal Server Error"
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
    const { id } = req.params;
    const user = await usersServices.findOne(+id);
    return res.status(StatusCodes.OK).json(user);
});

userRouter.patch('/posts/users/:id', authenticate, validate(requestUserUpdateSchema),async (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Users']
        #swagger.description = 'update user specified by ID'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The user ID that was registered in the system',
            type: 'number'
        }
    
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'User data.',
            required: true,
            schema: {
                name: "joão da silva pereira"
            }
        }

        #swagger.responses[200] = {
            schema: { 
                id: 5,
                name: "joão da silva pereira",
                updatedAt: "null",
                createdAt: "2024-05-19T11:11:43.799Z",
                deletedAt: "null"
            }
        }
    
        #swagger.responses[404] = {
            schema: { 
                message: "Um usuário com esse id não está cadastrado no sistema"
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

    
    const { id } = req.params;
    const { body } = req;
    const user = await usersServices.update(+id, body);
    return res.status(StatusCodes.OK).json(user);
});

userRouter.delete('/posts/users/:id', authenticate, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Users']
        #swagger.description = 'removes a user from the specified id'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The user ID that was registered in the system',
            type: 'number'
        }

        #swagger.responses[200] = {
            schema: { 
                delete: true
            }
        }

        #swagger.responses[404] = {
            schema: { 
                message: "Usuário não encontrado para exclusão"
            }
        }

        #swagger.responses[401] = {
            schema: { 
                message: "Token inválido. Forneça um token de autenticação válido."
            }
        }

        #swagger.responses[500] = {
            schema: { 
                message: "Internal Server Error"
            }
        }

        #swagger.security = [{
            "apiKeyAuth": []
        }]   
    */
    const { id } = req.params;
    const user = await usersServices.remove(+id);
    return res.status(StatusCodes.OK).json(user);
});

export { userRouter };