import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { protect } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/role.middleware';
import { validate } from '../../../middleware/validate';
import { createCustomerSchema, searchCustomerSchema } from '../validators/customer.schema';
import { ROLES } from '../../access-control/constants/access.constants';

const router = Router();

router.use(protect);

// STAFF needs to create customers during billing
router.post(
    '/',
    authorize([ROLES.ADMIN, ROLES.STAFF]),
    validate(createCustomerSchema),
    CustomerController.create
);

router.get(
    '/search',
    authorize([ROLES.ADMIN, ROLES.STAFF]),
    validate(searchCustomerSchema),
    CustomerController.search
);

export default router;
