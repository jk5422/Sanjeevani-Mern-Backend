import { z } from 'zod';

// Country
export const createCountrySchema = z.object({
    body: z.object({
        name: z.string().min(2),
        isoCode: z.string().length(2).transform(val => val.toUpperCase()),
        phoneCode: z.string().min(2),
    }),
});

// State
export const createStateSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        countryId: z.number().int().positive(),
    }),
});

// City
export const createCitySchema = z.object({
    body: z.object({
        name: z.string().min(2),
        stateId: z.number().int().positive(),
    }),
});

// Region
export const createRegionSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        cityId: z.number().int().positive(),
    }),
});
