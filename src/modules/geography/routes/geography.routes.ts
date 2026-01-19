import { Router } from 'express';
import { GeographyController } from '../controllers/geography.controller';
import { protect } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/role.middleware';
import { validate } from '../../../middleware/validate';
import {
    createCountrySchema,
    createStateSchema,
    createCitySchema,
    createRegionSchema,
} from '../validators/geography.schema';
import { ROLES } from '../../access-control/constants/access.constants';

const router = Router();

router.use(protect); // All routes require login

// Country
router.post(
    '/countries',
    authorize([ROLES.ADMIN]),
    validate(createCountrySchema),
    GeographyController.createCountry
);
router.get('/countries', GeographyController.getCountries);

// State
router.post(
    '/states',
    authorize([ROLES.ADMIN]),
    validate(createStateSchema),
    GeographyController.createState
);
router.get('/states', GeographyController.getStates);

// City
router.post(
    '/cities',
    authorize([ROLES.ADMIN]),
    validate(createCitySchema),
    GeographyController.createCity
);
router.get('/cities', GeographyController.getCities);

// Region
router.post(
    '/regions',
    authorize([ROLES.ADMIN]),
    validate(createRegionSchema),
    GeographyController.createRegion
);
router.get('/regions', GeographyController.getRegions);

export default router;
