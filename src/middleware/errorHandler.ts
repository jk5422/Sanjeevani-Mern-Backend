import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { config } from '../config/env';

export const globalErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let status = 'error';
    let message = 'Internal Server Error';

    // 1. Handle Trusted Operational Errors
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        status = err.status;
        message = err.message;
    }
    // 2. Handle Zod Validation Errors
    else if (err instanceof ZodError) {
        statusCode = 400;
        status = 'fail';
        message = 'Validation Error';
        // Combine all validation issues into one string or object
        // For MVP clarity, we'll send the issues
        return res.status(statusCode).json({
            status,
            errors: err.issues,
        });
    }
    // 3. Handle Unexpected Errors
    else {
        console.error('💥 ERROR 💥', err); // Log for debugging
    }

    // Send Response
    res.status(statusCode).json({
        status,
        message,
        ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
