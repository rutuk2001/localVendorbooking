import { Router } from 'express';
import * as serviceController from '../controllers/serviceController.js';
import { protect } from '../middleware/auth.js';
import { isVendorOrAdmin } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { createServiceSchema, updateServiceSchema } from '../validators/serviceValidators.js';

const router = Router();

router.get('/', serviceController.listServices);
router.get('/:id', serviceController.getService);
router.post('/', protect, isVendorOrAdmin, validate(createServiceSchema), serviceController.createService);
router.put('/:id', protect, isVendorOrAdmin, validate(updateServiceSchema), serviceController.updateService);
router.delete('/:id', protect, isVendorOrAdmin, serviceController.deleteService);

export default router;
