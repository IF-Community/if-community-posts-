import { Router, Request, Response } from 'express';
import { CategorieServices } from '../services/categories/categories.services';
import { StatusCodes } from 'http-status-codes';
import validate from '../middlewares/validation/validationMiddleware';
import { categoryRequestSchema } from '../schemas';
import authenticate from '../middlewares/authenticate/authenticate';

const categoryRouter = Router();

const categorieServices = new CategorieServices();

categoryRouter.post('/categories', authenticate, validate(categoryRequestSchema), async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Categories']
        #swagger.description = 'adding new category to microservice'

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'category data.',
            required: true,
            schema: {
                name: "Tecnologia da informação"
            }
        }

        #swagger.responses[201] = {
            schema: { 
                name: "Tecnologia da informação",
                updatedAt: "null",
                id: 3,
                createdAt: "2024-05-18T12:23:36.854Z",
                deletedAt: "null"
            }
        }

        #swagger.responses[409] = {
            schema: { 
                errors: "Uma categoria com esse nome já foi cadastrada no sistema"
            }
        }

        #swagger.responses[400] = {
            schema: { 
                errors: "(error message) no (parameter)"
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
    const { body } = req;
    const newCategory = await categorieServices.create(body);
    return res.status(StatusCodes.CREATED).json(newCategory);
});

categoryRouter.get('/categories', authenticate, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Categories']
        #swagger.description = 'lists all categories registered in the system'

        #swagger.responses[200] = {
            schema: { 
                "totalPages": 1,
                "results": [
                    {
                        "id": 1,
                        "createdAt": "2024-05-19T13:38:28.030Z",
                        "updatedAt": "null",
                        "deletedAt": "null",
                        "name": "Tecnologia"
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

    const categorys = await categorieServices.find(pageNumber, pageSize);
    return res.status(StatusCodes.OK).json(categorys);
});

categoryRouter.get('/categories/:id', authenticate, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Categories']
        #swagger.description = 'search for a category by ID'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The category ID',
            type: 'number'
        }

        #swagger.responses[201] = {
            schema: { 
                name: "Tecnologia da informação",
                updatedAt: "null",
                id: 3,
                createdAt: "2024-05-18T12:23:36.854Z",
                deletedAt: "null"
            }
        }

        #swagger.responses[404] = {
            schema: { 
                message: "Categoria com esse id não está cadastrado no sistema"
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
    const category = await categorieServices.findOne(+id);
    return res.status(StatusCodes.OK).json(category);
});

categoryRouter.patch('/categories/:id', authenticate, validate(categoryRequestSchema),async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Categories']
        #swagger.description = 'update category specified by ID'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The category ID',
            type: 'number'
        }
        
                #swagger.parameters['body'] = {
            in: 'body',
            description: 'category data.',
            required: true,
            schema: {
                name: "Tecnologia da informação"
            }
        }

        #swagger.responses[201] = {
            schema: { 
                name: "Tecnologia da informação",
                updatedAt: "null",
                id: 3,
                createdAt: "2024-05-18T12:23:36.854Z",
                deletedAt: "null"
            }
        }

        #swagger.responses[409] = {
            schema: { 
                errors: "Uma categoria com esse nome já foi cadastrada no sistema"
            }
        }

        #swagger.responses[404] = {
            schema: { 
                message: "Categoria com esse id não está cadastrado no sistema"
            }
        }

        #swagger.responses[400] = {
            schema: { 
                errors: "(error message) no (parameter)"
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
    const { body } = req;
    const category = await categorieServices.update(+id, body);
    return res.status(StatusCodes.OK).json(category);
});

categoryRouter.delete('/categories/:id', authenticate, async (req: Request, res: Response) => {
    /* 
        #swagger.tags = ['Categories']
        #swagger.description = 'removes a category from the specified id'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The category ID',
            type: 'number'
        }
        
        #swagger.responses[200] = {
            schema: { 
                delete: true
            }
        }


        #swagger.responses[404] = {
            schema: { 
                message: "Categoria com esse id não está cadastrado no sistema"
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
    const category = await categorieServices.remove(+id);
    return res.status(StatusCodes.OK).json(category);
});

export { categoryRouter };