import { z } from 'zod';
import { RoleType } from '@prisma/client';

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
    }),
});

export const registerSchema = z.object({
    body: z.object({
        firstName: z.string().min(2),
        lastName: z.string().optional(),
        email: z.string().email(),
        mobile: z.string().regex(/^[0-9]{10,15}$/, 'Invalid mobile number'),
        password: z.string().min(6),
        role: z.nativeEnum(RoleType),
        shopeeId: z.number().int().positive(),
    }),
});
