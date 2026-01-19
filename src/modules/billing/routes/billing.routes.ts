import { Router } from 'express';
import { BillingController } from '../controllers/billing.controller';
import { protect } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/role.middleware';
import { validate } from '../../../middleware/validate';
import { createInvoiceSchema, addPaymentSchema } from '../validators/billing.schema';
import { ROLES } from '../../access-control/constants/access.constants';

const router = Router();

router.use(protect);

router.post(
    '/invoices',
    authorize([ROLES.ADMIN, ROLES.STAFF]),
    validate(createInvoiceSchema),
    BillingController.createInvoice
);

router.post(
    '/invoices/:id/payments',
    authorize([ROLES.ADMIN, ROLES.STAFF]),
    validate(addPaymentSchema),
    BillingController.addPayment
);

router.get(
    '/invoices/:id',
    authorize([ROLES.ADMIN, ROLES.STAFF]),
    BillingController.getInvoiceById
);

export default router;
