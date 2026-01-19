import { z } from 'zod';
import { PaymentMode } from '@prisma/client';

const itemSchema = z.object({
    productBatchId: z.number().int().positive(),
    quantity: z.number().int().positive().min(1),
});

export const createInvoiceSchema = z.object({
    body: z.object({
        customerId: z.number().int().positive().optional(),
        customerName: z.string().min(2).optional(),
        mobile: z.string().regex(/^[0-9]{10,15}$/).optional(),
        referenceAscplId: z.string().optional(),
        paymentMode: z.nativeEnum(PaymentMode),
        items: z.array(itemSchema).nonempty('At least one item is required'),
        remarks: z.string().optional(),
    }),
});

export const addPaymentSchema = z.object({
    body: z.object({
        amount: z.number().positive(),
        mode: z.nativeEnum(PaymentMode),
        refNo: z.string().optional(),
    }),
});
