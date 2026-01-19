import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/responseHandler';
import { HttpStatus } from '../../../shared/constants';

export class AuthController {
    static login = catchAsync(async (req: Request, res: Response) => {
        const result = await AuthService.login(req.body);
        sendResponse(res, result, HttpStatus.OK, 'Logged in successfully');
    });

    static register = catchAsync(async (req: Request, res: Response) => {
        const result = await AuthService.register(req.body);
        sendResponse(res, result, HttpStatus.CREATED, 'User registered successfully');
    });
}
