import { Request, Response } from 'express';
import { OrganizationService } from '../services/organization.service';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/responseHandler';
import { HttpStatus } from '../../../shared/constants';
import { AppError } from '../../../utils/AppError';

export class OrganizationController {
    static createShopee = catchAsync(async (req: Request, res: Response) => {
        const result = await OrganizationService.createShopee(req.body);
        sendResponse(res, result, HttpStatus.CREATED, 'Shopee created successfully');
    });

    static getShopees = catchAsync(async (req: Request, res: Response) => {
        const result = await OrganizationService.getShopees();
        sendResponse(res, result, HttpStatus.OK);
    });

    static getShopeeById = catchAsync(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const result = await OrganizationService.getShopeeById(id);
        if (!result) {
            throw new AppError('Shopee not found', HttpStatus.NOT_FOUND);
        }
        sendResponse(res, result, HttpStatus.OK);
    });
}
