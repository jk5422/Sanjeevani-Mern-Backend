import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { protect } from '../../../middleware/auth.middleware';
import { authorize as requireRole } from '../../../middleware/role.middleware';
import { validate } from '../../../middleware/validate';
import { createShopeeSchema } from '../validators/organization.schema';
import { ROLES } from '../../access-control/constants/access.constants';

const router = Router();

router.use(protect);

router.post(
    '/shopees',
    requireRole([ROLES.ADMIN]),
    validate(createShopeeSchema),
    OrganizationController.createShopee
);

router.get('/shopees', OrganizationController.getShopees);
router.get('/shopees/:id', OrganizationController.getShopeeById);

export default router;
