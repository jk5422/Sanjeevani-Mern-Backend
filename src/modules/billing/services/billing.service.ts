import { prisma } from '../../../shared/prisma';
import { AppError } from '../../../utils/AppError';
import { CustomerService } from './customer.service';
import { HttpStatus } from '../../../shared/constants';
import { PaymentStatus, BillStatus } from '@prisma/client';

const generateInvoiceNo = async () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `INV-${dateStr}-${random}`;
};

export class BillingService {
    static async createInvoice(data: any, user: { userId: number; shopeeId: number }) {
        const { items, customerId, mobile, customerName, referenceAscplId, paymentMode, remarks } = data;

        // 1. Customer Resolution
        let finalCustomerId = customerId;
        if (!finalCustomerId && mobile && customerName) {
            let existing = await prisma.customer.findUnique({ where: { mobile } });
            if (!existing) {
                existing = await prisma.customer.create({ data: { name: customerName, mobile } });
            }
            finalCustomerId = existing.id;
        }
        if (!finalCustomerId) throw new AppError('Customer is required', HttpStatus.BAD_REQUEST);
        const customer = await prisma.customer.findUnique({ where: { id: finalCustomerId } });
        if (!customer) throw new AppError("Invalid Customer", HttpStatus.BAD_REQUEST);

        // 2. Transaction
        return prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            let totalSp = 0;
            const invoiceItemsData = [];

            // 3. Inventory & Calc
            for (const item of items) {
                const batch = await tx.productBatch.findUnique({ where: { id: item.productBatchId } });
                if (!batch) throw new AppError(`Invalid Batch ID: ${item.productBatchId}`, HttpStatus.BAD_REQUEST);
                if (batch.shopeeId !== user.shopeeId) throw new AppError(`Batch ${batch.batchNo} mismatch`, HttpStatus.FORBIDDEN);
                if (batch.currentStock < item.quantity) throw new AppError(`Insufficient stock for Batch ${batch.batchNo}`, HttpStatus.BAD_REQUEST);

                await tx.productBatch.update({
                    where: { id: batch.id },
                    data: { currentStock: { decrement: item.quantity } },
                });

                const price = Number(batch.dp);
                const points = Number(batch.sp);
                const lineAmount = price * item.quantity;
                const linePoints = points * item.quantity;

                totalAmount += lineAmount;
                totalSp += linePoints;

                invoiceItemsData.push({
                    productId: batch.productId,
                    batchId: batch.id,
                    quantity: item.quantity,
                    snapshotMrp: batch.mrp,
                    snapshotDp: batch.dp,
                    snapshotSp: batch.sp,
                    lineTotal: lineAmount,
                    lineSp: linePoints,
                });
            }

            // 4. Persistence
            const invoiceNo = await generateInvoiceNo();
            const invoice = await tx.invoice.create({
                data: {
                    invoiceNo,
                    customerId: finalCustomerId,
                    receivingPartyName: customer.name,
                    referenceAscplId: referenceAscplId || null,
                    totalAmount,
                    totalSp,
                    paymentMode,
                    remarks,
                    userId: user.userId,
                    shopeeId: user.shopeeId,
                    status: 'GENERATED',
                    items: { create: invoiceItemsData },
                    // Initial Payment
                    payments: {
                        create: {
                            amount: totalAmount, // Assuming full payment initially? Or strictly logic based
                            mode: paymentMode,
                            status: 'COMPLETED'
                        }
                    }
                },
                include: { items: true, payments: true, customer: true }
            });
            return invoice;
        });
    }

    static async addPayment(invoiceId: number, data: any) {
        const { amount, mode, refNo } = data;

        return prisma.$transaction(async (tx) => {
            // 1. Get Invoice & Existing Payments
            const invoice = await tx.invoice.findUnique({
                where: { id: invoiceId },
                include: { payments: true }
            });
            if (!invoice) throw new AppError('Invoice not found', HttpStatus.NOT_FOUND);

            // 2. Validate Overpayment
            const currentTotalPaid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
            const dueAmount = Number(invoice.totalAmount) - currentTotalPaid;

            if (amount > dueAmount) {
                throw new AppError(
                    `Payment amount (${amount}) exceeds due amount (${dueAmount})`,
                    HttpStatus.BAD_REQUEST
                );
            }

            // 3. Add Payment
            const payment = await tx.payment.create({
                data: {
                    invoiceId,
                    amount,
                    mode,
                    refNo,
                    status: 'COMPLETED'
                }
            });

            return payment;
        });
    }

    static async getInvoiceById(id: number) {
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                payments: true,
                customer: true,
                user: { select: { firstName: true, lastName: true } }
            }
        });

        if (!invoice) return null;

        // Calculate Derived Fields
        const totalPaid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const dueAmount = Number(invoice.totalAmount) - totalPaid;

        return {
            ...invoice,
            totalPaid,
            dueAmount: dueAmount > 0 ? dueAmount : 0 // Should not be negative
        };
    }
}
