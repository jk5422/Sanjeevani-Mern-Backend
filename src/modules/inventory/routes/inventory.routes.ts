import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { protect } from '../../../middleware/auth.middleware';
import { authorize } from '../../../middleware/role.middleware';
import { validate } from '../../../middleware/validate';
import {
    createProductSchema,
    searchProductSchema,
    createBatchSchema,
} from '../validators/inventory.schema';
import { ROLES } from '../../access-control/constants/access.constants';

const router = Router();

router.use(protect);

// Products
router.post(
    '/products',
    authorize([ROLES.ADMIN]),
    validate(createProductSchema),
    InventoryController.createProduct
);

router.get(
    '/products/search',
    validate(searchProductSchema),
    InventoryController.searchProducts
);

// Batches
router.post(
    '/batches',
    authorize([ROLES.ADMIN]),
    validate(createBatchSchema),
    InventoryController.addBatch
);

router.get('/batches', InventoryController.getBatches);

export default router;
