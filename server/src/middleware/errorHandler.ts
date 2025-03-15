import { Request, Response, NextFunction } from 'express';
/**
 * Error Handling Module
 * */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default if no toher  status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  // error response
  const errorResponse = {
    status: 'error',
    statusCode: statusCode,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Log error
  console.error(err);
  res.status(statusCode).json(errorResponse);
};
