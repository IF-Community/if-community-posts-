import 'express-async-errors';
import express from "express";
import helmet from "helmet";
import cors from "cors";
import AppDataSource from './database/data-source';
import { errorMiddleware } from './middlewares/error/error.middlewares';
import { categoryRouter, postRouter, userRouter, votePostRouter } from './routes';

import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../swagger-output.json";

AppDataSource.initialize().then(() => {
    const app = express();
    
    app.use(express.json());
    app.use(helmet());
    app.use(cors());
    
    app.use(userRouter);
    app.use(categoryRouter);
    app.use(postRouter);
    app.use(votePostRouter);
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
    app.use(errorMiddleware);


    const PORT_API = Number(process.env.PORT_API ?? '3000');

    const server = app.listen(PORT_API, () => {
        console.log(`=-=-=-=-=-=-=-=- SERVER STARTED 🚀 =-=-=-=-=-=-=-=-=`);
        console.log(`DOOR: ${PORT_API}`);
        console.log(`URL BASE: http://localhost:${PORT_API}`);
        console.log(`DOCS SWAGGER: http://localhost:${PORT_API}/api-docs`);
        console.log(`\nDATABASE:`);
        console.log(`NAME: ${process.env.BD_USERNAME}`);
        console.log(`DOOR: ${process.env.PORT}`);
        console.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`);
    });
  
    return server;
}).catch((error) => {
    console.error("Erro ao inicializar o banco de dados:", error);
})