import { Request, Response } from 'express';
import { GeographyService } from '../services/geography.service';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/responseHandler';
import { HttpStatus } from '../../../shared/constants';

export class GeographyController {
    // --- Country ---
    static createCountry = catchAsync(async (req: Request, res: Response) => {
        const result = await GeographyService.createCountry(req.body);
        sendResponse(res, result, HttpStatus.CREATED, 'Country created successfully');
    });

    static getCountries = catchAsync(async (req: Request, res: Response) => {
        const result = await GeographyService.getCountries();
        sendResponse(res, result, HttpStatus.OK);
    });

    // --- State ---
    static createState = catchAsync(async (req: Request, res: Response) => {
        const result = await GeographyService.createState(req.body);
        sendResponse(res, result, HttpStatus.CREATED, 'State created successfully');
    });

    static getStates = catchAsync(async (req: Request, res: Response) => {
        const countryId = Number(req.query.countryId);
        const result = await GeographyService.getStates(countryId);
        sendResponse(res, result, HttpStatus.OK);
    });

    // --- City ---
    static createCity = catchAsync(async (req: Request, res: Response) => {
        const result = await GeographyService.createCity(req.body);
        sendResponse(res, result, HttpStatus.CREATED, 'City created successfully');
    });

    static getCities = catchAsync(async (req: Request, res: Response) => {
        const stateId = Number(req.query.stateId);
        const result = await GeographyService.getCities(stateId);
        sendResponse(res, result, HttpStatus.OK);
    });

    // --- Region ---
    static createRegion = catchAsync(async (req: Request, res: Response) => {
        const result = await GeographyService.createRegion(req.body);
        sendResponse(res, result, HttpStatus.CREATED, 'Region created successfully');
    });

    static getRegions = catchAsync(async (req: Request, res: Response) => {
        const cityId = Number(req.query.cityId);
        const result = await GeographyService.getRegions(cityId);
        sendResponse(res, result, HttpStatus.OK);
    });
}
