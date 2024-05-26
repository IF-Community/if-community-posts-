import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import dotenv from 'dotenv';
import { ApiError } from '../../helpers/api-error';
dotenv.config();

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header("api-key");

    if (process.env.API_KEY !== apiKey) {
        throw new ApiError(
            'Token inválido. Forneça um token de autenticação válido.',
            StatusCodes.UNAUTHORIZED
        );
    }
    next();
  };

export default authenticate;