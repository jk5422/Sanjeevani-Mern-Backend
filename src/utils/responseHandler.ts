import { Response } from 'express';
import { HttpStatus } from '../shared/constants';

type ApiResponse<T> = {
    status: 'success' | 'fail';
    message?: string;
    data: T;
};

export const sendResponse = <T>(
    res: Response,
    data: T,
    statusCode: HttpStatus = HttpStatus.OK,
    message?: string
) => {
    const response: ApiResponse<T> = {
        status: 'success', // Default for 2xx. 4xx/5xx handled by Global Error Handler
        message,
        data,
    };
    return res.status(statusCode).json(response);
};
