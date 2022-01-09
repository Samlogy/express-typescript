class AppError extends Error {
	constructor(message: string, statusCode: number) {
		super()
		this.message = message
		this.statusCode = statusCode
		this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error'
		this.isOperational = true
		Error.captureStackTrace(this, this.constructor)
	}
}
module.exports = AppError