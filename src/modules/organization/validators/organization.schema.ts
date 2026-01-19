import { z } from 'zod';

export const createShopeeSchema = z.object({
    body: z.object({
        shopeeCode: z.string().min(2),
        name: z.string().min(3),
        contactNo: z.string().regex(/^[0-9]{10,15}$/, 'Invalid contact number'),
        email: z.string().email().optional(),
        ownerName: z.string().min(2),
        ownerContact: z.string().regex(/^[0-9]{10,15}$/, 'Invalid owner contact'),
        ownerEmail: z.string().email().optional(),
        address: z.string().min(10),
        gstNo: z.string().length(15).optional(),
        cin: z.string().length(21).optional(),
        pan: z.string().length(10).optional(),
        cityId: z.number().int().positive(),
        regionId: z.number().int().positive(),
    }),
});
