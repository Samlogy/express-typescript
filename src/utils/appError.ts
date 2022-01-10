// class AppError extends Error {
// 	constructor(message: string, statusCode: number) {
// 		super()
// 		this.message = message
// 		this.statusCode = statusCode
// 		// this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error'
// 		// this.isOperational = true
// 		Error.captureStackTrace(this, this.constructor)
// 	}
// }
// module.exports = AppError

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