import { prisma } from '../../../shared/prisma';

export class GeographyService {
    // --- Country ---
    static async createCountry(data: {
        name: string;
        isoCode: string;
        phoneCode: string;
    }) {
        return prisma.country.create({ data });
    }

    static async getCountries() {
        return prisma.country.findMany({ orderBy: { name: 'asc' } });
    }

    // --- State ---
    static async createState(data: { name: string; countryId: number }) {
        return prisma.state.create({ data });
    }

    static async getStates(countryId: number) {
        return prisma.state.findMany({
            where: { countryId },
            orderBy: { name: 'asc' },
        });
    }

    // --- City ---
    static async createCity(data: { name: string; stateId: number }) {
        return prisma.city.create({ data });
    }

    static async getCities(stateId: number) {
        return prisma.city.findMany({
            where: { stateId },
            orderBy: { name: 'asc' },
        });
    }

    // --- Region ---
    static async createRegion(data: { name: string; cityId: number }) {
        return prisma.region.create({ data });
    }

    static async getRegions(cityId: number) {
        return prisma.region.findMany({
            where: { cityId },
            orderBy: { name: 'asc' },
        });
    }
}
