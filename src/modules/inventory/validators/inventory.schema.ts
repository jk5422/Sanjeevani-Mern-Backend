import { z } from 'zod';

// 1. Product Master
export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(3),
        shortName: z.string().optional(),
        description: z.string().optional(),
        hsnCode: z.string().optional(),
        brand: z.string().optional(),
    }),
});

export const searchProductSchema = z.object({
    query: z.object({
        term: z.string().min(1),
    }),
});

// 2. Product Batch (Inventory Adding)
export const createBatchSchema = z.object({
    body: z.object({
        productId: z.number().int().positive(),
        shopeeId: z.number().int().positive(),
        batchNo: z.string().min(1),
        expiryDate: z.string().datetime(), // ISO Date String
        mrp: z.number().positive(),
        dp: z.number().positive(),
        sp: z.number().positive(),
        currentStock: z.number().int().nonnegative(),
    }),
});
