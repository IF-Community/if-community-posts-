import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../helpers/api-error';
import { StatusCodes } from 'http-status-codes';

export const errorMiddleware = (
	error: Error & Partial<ApiError>,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log("🚀 ~ error: ", error.message)
	const statusCode = error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
	const message = error.statusCode ? error.message : 'Internal Server Error';
	return res.status(statusCode).json({ message });
}