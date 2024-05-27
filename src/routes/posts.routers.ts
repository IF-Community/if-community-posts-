import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PostController } from '../controllers/posts/posts.controller';
import validate from '../middlewares/validation/validationMiddleware';
import { postRequestSchema, tagsSchema } from '../schemas';
import authenticate from '../middlewares/authenticate/authenticate';
import { ApiError } from '../helpers/api-error';

const postRouter = Router();
const postController = new PostController();

postRouter.post('/posts', authenticate, validate(postRequestSchema),async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Posts']
        #swagger.description = 'adding new post to microservice' 

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Post data.',
            required: true,
            schema: {
                userId: 1,
                title: "titulo do post aqui",
                content: "algum conteudo aqui...",
                categories: [
                    { name: "Tecnologia" },
                    { name: "Programação" }
                ]
            }
        }

        #swagger.responses[201] = {
            schema: { 
                userId: 1,
                title: "testando post 3",
                content: "testando 1234",
                categories: [
                    {
                        name: "Tecnologia"
                    },
                    {
                        name: "Programação"
                    }
                ],
                updatedAt: "null",
                id: 1,
                createdAt: "2024-05-19T16:40:49.565Z",
                deletedAt: "null",
                totalUpvotes: 0
            }
        }


        #swagger.responses[500] = {
            schema: { 
                message: "Internal Server Error"
            }
        }

        #swagger.responses[404] = {
            schema: { 
                message: "Um usuário com esse id não está cadastrado no sistema"
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
    const newPost = await postController.create(body);
    return res.status(StatusCodes.CREATED).json(newPost);
});

postRouter.get('/posts', authenticate, async (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Posts']
        #swagger.description = 'lists all posts registered in the system'

        #swagger.responses[500] = {
            schema: { 
                message: "Internal Server Error"
            }
        }

        #swagger.responses[201] = {
            schema: { 
                totalPages: 1,
                results: [{
                    id: 1,
                    createdAt: "2024-05-19T16:40:49.565Z",
                    updatedAt: "null",
                    deletedAt: "null",
                    title: "testando post 3",
                    content: "testando 1234",
                    totalUpvotes: 0,
                    "posts_categories": [{
                        category: {
						    id: 2,
						    name: "Tecnologia"
					    }
                    },
                    {
                        category: {
						    id: 5,
						    name: "Programação"
					    }
                    }],
                    user: {
                        id: 1,
				        createdAt: "2024-05-19T11:01:59.858Z",
				        updatedAt: "null",
				        name: "joão doria"
                    },
                }],
                
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

        #swagger.parameters['popularity'] = {
            in: 'query',
            description: 'Sorting data by popularity or most recent\n (pattern false)',
            type: 'boolean'
        } 
    */

    const pageNumber = Number(req.query.pageNumber as string) || 1;
    const pageSize = Number(req.query.pageSize as string) || 10;
    const popularity = req.query.popularity === 'true';

    const posts = await postController.find(pageNumber, pageSize, popularity);
    return res.status(StatusCodes.OK).json(posts);
});


postRouter.get('/posts/categories', authenticate,async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Posts/Categories']
        #swagger.description = 'lists posts by categories'

        #swagger.parameters['tags'] = {
            in: 'query',
            required: true,
            description: 'The list of tags (separate by \",\" )',
            type: 'string'
        }
        
        #swagger.responses[201] = {
            schema: { 
                "totalPages": 1,
                "results": [
                    {
                        "postid": 1,
                        "post_title": "testando post 3",
                        "post_content": "testando 1234",
                        "post_upvotes": "0",
                        "created_at": "2024-05-19T16:40:49.565Z",
                        "updated_at": "null",
                        "user": {
                            "id": 1,
                            "name": "joão doria"
                        },
                        "categories": [
                            {
                                "id": 2,
                                "name": "Tecnologia"
                            },
                            {
                                "id": 3,
                                "name": "Programação"
                            }
                        ]
                    }
                ]
                }
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

        #swagger.responses[401] = {
            schema: { 
                message: "Token inválido. Forneça um token de autenticação válido."
            }
        }

        #swagger.security = [{
            "apiKeyAuth": []
        }]  

    */

    const pageNumber = Number(req.query.pageNumber as string) || 1;
    const pageSize = Number(req.query.pageSize as string) || 10;


    if(!req.query.tags){
        throw new ApiError('Você precisa informar a query com as tags',
        StatusCodes.BAD_REQUEST);
    }

    const tags = typeof req.query.tags === 'string' ? req.query.tags.split(',') : [];

    const posts = await postController.findByCategories(tags, pageNumber, pageSize);
    return res.status(StatusCodes.OK).json(posts);
});

postRouter.get('/posts/:id', authenticate, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Posts']
        #swagger.description = 'search post for ID'
        
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The post ID',
            type: 'number'
        }
        
        #swagger.responses[200] = {
            schema: { 
                "id": 1,
                "createdAt": "2024-05-19T16:40:49.565Z",
                "updatedAt": null,
                "deletedAt": null,
                "title": "testando post 3",
                "content": "testando 1234",
                "totalUpvotes": 0,
                "userId": "1",
                "posts_categories": [
                    {
                        "category": {
                            "id": 2,
                            "name": "Tecnologia"
                        }
                    },
                    {
                        "category": {
                            "id": 3,
                            "name": "Programação"
                        }
                    }
                ],
                "user": {
                    "id": 1,
                    "createdAt": "2024-05-19T11:01:59.858Z",
                    "updatedAt": null,
                    "name": "joão doria"
                }
            }
        }

        #swagger.responses[404] = {
            schema: { 
                message: "O post com o id informado não foi encontrado no sistema"
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
    const posts = await postController.findOne(+id);
    return res.status(StatusCodes.OK).json(posts);
});

postRouter.get('/posts/users/:id', authenticate, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Posts/Users']
        #swagger.description = 'lists all posts by user ID registered in the system'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The post ID',
            type: 'number'
        }

        #swagger.responses[200] = {
            schema: { 
                "user": {
                    "id": 1,
                    "name": "João da costa",
                    "createdAt": "2024-05-16T10:53:50.187Z",
                    "updatedAt": "2024-05-16T11:42:44.511Z",
                    "deletedAt": "null"
                },
                "totalPages": 1,
                "posts": [
                    {
                        "id": 4,
                        "createdAt": "2024-05-16T17:42:59.774Z",
                        "updatedAt": "null",
                        "deletedAt": "null",
                        "title": "testando post 3",
                        "content": "testando 1234",
                        "totalUpvotes": 0,
                        "userId": "1",
                        "posts_categories": []
                    },
                    {
                        "id": 3,
                        "createdAt": "2024-05-16T12:46:38.293Z",
                        "updatedAt": "2024-05-16T12:56:22.475Z",
                        "deletedAt": "null",
                        "title": "testando post 3",
                        "content": "testando 1234",
                        "totalUpvotes": 1,
                        "userId": "1",
                        "posts_categories": []
                    }
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

    const pageNumber = Number(req.query.pageNumber as string) || 1;
    const pageSize = Number(req.query.pageSize as string) || 10;

    const { id } = req.params;

    const posts = await postController.findByUser(+id, pageNumber, pageSize);
    return res.status(StatusCodes.OK).json(posts);
});


postRouter.get('/posts/search/:search', authenticate, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Posts/Search']
        #swagger.description = 'lists all posts by Search string (search by title and content)'

        #swagger.parameters['search'] = {
            in: 'path',
            description: 'The post search parameters',
            type: 'string'
        }

        #swagger.responses[200] = {
            schema: {
                "totalPages": 1,
                "results": [
                    {
                        "id": 4,
                        "createdAt": "2024-05-20T01:23:03.842Z",
                        "updatedAt": null,
                        "deletedAt": null,
                        "title": "alguma coisa aqui mano",
                        "content": "tecnologia e analise de sistemas",
                        "totalUpvotes": 0,
                        "posts_categories": [
                            {
                                "category": {
                                    "id": 2,
                                    "name": "Tecnologia"
                                }
                            },
                            {
                                "category": {
                                    "id": 3,
                                    "name": "Programação"
                                }
                            }
                        ],
                        "user": {
                            "id": 1,
                            "createdAt": "2024-05-19T11:01:59.858Z",
                            "updatedAt": null,
                            "name": "joão doria"
                        }
                    }
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

    const pageNumber = Number(req.query.pageNumber as string) || 1;
    const pageSize = Number(req.query.pageSize as string) || 10;

    const { search } = req.params;

    const posts = await postController.findByQuery(search, pageNumber, pageSize);
    return res.status(StatusCodes.OK).json(posts);
});


postRouter.patch('/posts/:id', authenticate, validate(postRequestSchema), async (req: Request, res: Response) => {
    
    /*
        #swagger.tags = ['Posts']
        #swagger.description = 'search for a post ID'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The post ID',
            type: 'number'
        }

        #swagger.responses[200] = {
            schema: { 
                "id": 1,
                "createdAt": "2024-05-19T16:40:49.565Z",
                "updatedAt": null,
                "deletedAt": null,
                "title": "testando post 3",
                "content": "testando 1234",
                "totalUpvotes": 0,
                "userId": "1",
                "posts_categories": [
                    {
                        "category": {
                            "id": 2,
                            "name": "Tecnologia"
                        }
                    },
                    {
                        "category": {
                            "id": 3,
                            "name": "Programação"
                        }
                    }
                ],
                "user": {
                    "id": 1,
                    "createdAt": "2024-05-19T11:01:59.858Z",
                    "updatedAt": null,
                    "name": "joão doria"
                }
            }
        }

        #swagger.responses[404] = {
            schema: { 
                message: "O post com o id informado não foi encontrado no sistema"
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
    const { body } = req;
    const  post = await postController.update(+id, body);
    return res.status(StatusCodes.OK).json(post);
});

postRouter.delete('/posts/:id', authenticate, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Posts']
        #swagger.description = 'removes a post from the specified id'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The post ID',
            type: 'number'
        }

        #swagger.responses[200] = {
            schema: { 
                delete: true
            }
        }

        #swagger.responses[404] = {
            schema: { 
                message: "Post não encontrado para exclusão"
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
    const { id } = req?.params;
    const post = await postController.remove(+id);
    return res.status(StatusCodes.OK).json(post);
});

export { postRouter };