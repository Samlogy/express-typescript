import { Response } from "express";


export const AppError = (res: Response, message: string, statusCode = 500, error = {}) => {
	res.status(statusCode).json({
	  success: false,
	  message,
	  error: {
		statusCode,
		message,
		error,
	  },
	});
};