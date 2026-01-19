import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/responseHandler';
import { HttpStatus } from '../../../shared/constants';

export class InventoryController {
    static createProduct = catchAsync(async (req: Request, res: Response) => {
        const result = await InventoryService.createProduct(req.body);
        sendResponse(res, result, HttpStatus.CREATED, 'Product created successfully');
    });

    static searchProducts = catchAsync(async (req: Request, res: Response) => {
        const term = req.query.term as string;
        const result = await InventoryService.searchProducts(term);
        sendResponse(res, result, HttpStatus.OK);
    });

    static addBatch = catchAsync(async (req: Request, res: Response) => {
        // In real app, createdBy should be req.user.userId
        const result = await InventoryService.addBatch(req.body);
        sendResponse(res, result, HttpStatus.CREATED, 'Batch added successfully');
    });

    static getBatches = catchAsync(async (req: Request, res: Response) => {
        const productId = Number(req.query.productId);
        const shopeeId = Number(req.query.shopeeId);
        if (!productId || !shopeeId) {
            // In a real validation scenario this is caught by schema, 
            // but just in case for query params not wrapped in body schema
        }
        const result = await InventoryService.getBatchesByProduct(productId, shopeeId);
        sendResponse(res, result, HttpStatus.OK);
    });
}
