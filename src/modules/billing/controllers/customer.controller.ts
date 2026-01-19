import { Request, Response } from 'express';
import { CustomerService } from '../services/customer.service';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/responseHandler';
import { HttpStatus } from '../../../shared/constants';

export class CustomerController {
    static create = catchAsync(async (req: Request, res: Response) => {
        const result = await CustomerService.create(req.body);
        sendResponse(res, result, HttpStatus.CREATED, 'Customer created successfully');
    });

    static search = catchAsync(async (req: Request, res: Response) => {
        const term = req.query.term as string;
        const result = await CustomerService.search(term);
        sendResponse(res, result, HttpStatus.OK);
    });
}
