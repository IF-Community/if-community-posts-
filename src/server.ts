import 'express-async-errors';
import express from "express";
import { router } from "./routes";
import helmet from "helmet";
import cors from "cors";


const app = express();
    
app.use(express.json());

app.use(helmet());
app.use(cors());

app.use(router);

const PORT_API = Number(process.env.PORT_API ?? '3000');

const server = app.listen(PORT_API, () => {
    console.log(`=-=-=-=-=-=-=-=- SERVIDOR INICIADO 🚀 =-=-=-=-=-=-=-=`);
    console.log(`PORTA: ${PORT_API}`);
    console.log(`URL: http://localhost:${PORT_API}`);
    console.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`);
});