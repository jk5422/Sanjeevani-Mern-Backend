import { prisma } from '../../../shared/prisma';

export class InventoryService {
    // --- Product Master ---
    static async createProduct(data: any) {
        return prisma.product.create({ data });
    }

    static async searchProducts(term: string) {
        return prisma.product.findMany({
            where: {
                isActive: true, // Only show active
                OR: [
                    { name: { contains: term, mode: 'insensitive' } },
                    { shortName: { contains: term, mode: 'insensitive' } },
                ],
            },
            take: 20,
            include: {
                // Include batches that have stock?
                // Actually, for global search, we just want products.
                // Specific stock is checked per Shopee usually.
            },
            orderBy: { name: 'asc' },
        });
    }

    // --- Batches (Stock) ---
    static async addBatch(data: any) {
        return prisma.productBatch.create({ data });
    }

    static async getBatchesByProduct(productId: number, shopeeId: number) {
        return prisma.productBatch.findMany({
            where: {
                productId,
                shopeeId,
                currentStock: { gt: 0 }, // Only show available
            },
            orderBy: { expiryDate: 'asc' }, // FIFO: Sell oldest first
        });
    }
}
