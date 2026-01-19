import { prisma } from '../../../shared/prisma';

export class CustomerService {
    static async create(data: any) {
        return prisma.customer.create({
            data,
        });
    }

    static async search(term: string) {
        return prisma.customer.findMany({
            where: {
                OR: [
                    { mobile: { contains: term } }, // Mobile is indexed
                    { name: { contains: term, mode: 'insensitive' } },
                    { email: { contains: term, mode: 'insensitive' } },
                    { ascplId: { contains: term, mode: 'insensitive' } },
                ],
            },
            take: 20, // Limit results for performance
            orderBy: { name: 'asc' },
        });
    }

    static async getById(id: number) {
        return prisma.customer.findUnique({ where: { id } });
    }
}
