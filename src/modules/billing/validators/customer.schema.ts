import { z } from 'zod';

export const createCustomerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name is required'),
        mobile: z.string().regex(/^[0-9]{10,15}$/, 'Invalid mobile number'),
        email: z.string().email().optional(),
        ascplId: z.string().min(3).optional(),
        address: z.string().optional(),
        cityId: z.number().int().positive().optional(),
        stateId: z.number().int().positive().optional(),
    }),
});

export const searchCustomerSchema = z.object({
    query: z.object({
        term: z.string().min(1, 'Search term is required'),
    }),
});
