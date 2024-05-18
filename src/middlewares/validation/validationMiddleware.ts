import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodSchema } from 'zod';


const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e: any) {
      const errorMessages = e.errors.map((err: any) => {
        if (err.path.length === 1 && err.code === "invalid_type") {
          return `${err.message} (${err.path[0]}) é obrigatório`;
        } else {
          return `(${err.path[0]}): ${err.message}`;
        }
      });
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorMessages });
    }
};

export default validate;