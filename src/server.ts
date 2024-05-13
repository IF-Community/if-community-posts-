import 'express-async-errors';
import express from "express";
import helmet from "helmet";
import cors from "cors";
import AppDataSource from './database/data-source';
import { errorMiddleware } from './middlewares/error/error.middlewares';
import { userRoutes } from './routes/user.routes';
import { categoriesRoutes } from './routes/categories.routes';
import { postRoutes } from './routes/post.routes';
import { votePost } from './routes/vote.routes';
import { postWithVotesRoutes } from './routes/post-votes.routes';
import { postCategoriesRoutes } from './routes/post-categories.routes';


AppDataSource.initialize().then(() => {
    const app = express();
    
    app.use(express.json());
    app.use(helmet());
    app.use(cors());
    
    app.use(categoriesRoutes);
    app.use(postRoutes);
    app.use(userRoutes);
    app.use(votePost);
    app.use(postWithVotesRoutes);
    app.use(postCategoriesRoutes)

    app.use(errorMiddleware);

    const PORT_API = Number(process.env.PORT_API ?? '3000');

    const server = app.listen(PORT_API, () => {
        console.log(`=-=-=-=-=-=-=-=- SERVIDOR INICIADO 🚀 =-=-=-=-=-=-=-=-=`);
        console.log(`PORTA: ${PORT_API}`);
        console.log(`URL: http://localhost:${PORT_API}`);
        console.log(`\nDATABASE:`);
        console.log(`NOME: ${process.env.BD_USERNAME}`);
        console.log(`PORTA: ${process.env.PORT}`);
        console.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`);
    });
  
    return server;
}).catch((error) => {
    console.error("Erro ao inicializar o banco de dados:", error);
})