import { prisma } from '../../../shared/prisma';

export class OrganizationService {
    static async createShopee(data: any) {
        return prisma.shopee.create({
            data,
        });
    }

    static async getShopees() {
        return prisma.shopee.findMany({
            include: {
                city: true,
                region: true,
            },
            orderBy: { name: 'asc' },
        });
    }

    static async getShopeeById(id: number) {
        return prisma.shopee.findUnique({
            where: { id },
            include: {
                city: true,
                region: true,
            },
        });
    }
}
