import { Request, Response } from 'express';
import { BillingService } from '../services/billing.service';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/responseHandler';
import { HttpStatus } from '../../../shared/constants';
import { AppError } from '../../../utils/AppError';

export class BillingController {
    static createInvoice = catchAsync(async (req: Request, res: Response) => {
        // User context is guaranteed by 'protect' middleware
        const userContext = {
            userId: req.user!.userId,
            shopeeId: req.user!.shopeeId,
        };

        const result = await BillingService.createInvoice(req.body, userContext);

        sendResponse(
            res,
            result,
            HttpStatus.CREATED,
            `Invoice ${result.invoiceNo} generated successfully`
        );
    });

    static addPayment = catchAsync(async (req: Request, res: Response) => {
        const invoiceId = Number(req.params.id);
        const result = await BillingService.addPayment(invoiceId, req.body);

        sendResponse(res, result, HttpStatus.CREATED, 'Payment added successfully');
    });

    static getInvoiceById = catchAsync(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const result = await BillingService.getInvoiceById(id);

        if (!result) {
            throw new AppError('Invoice not found', HttpStatus.NOT_FOUND);
        }

        sendResponse(res, result, HttpStatus.OK);
    });
}
