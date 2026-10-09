import { Router } from 'express';
import * as vendorController from '../controllers/vendorController.js';
import { protect } from '../middleware/auth.js';
import { isVendor } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { updateVendorProfileSchema } from '../validators/vendorValidators.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

router.get('/', vendorController.listVendors);
router.get('/me/profile', protect, isVendor, vendorController.getMyVendorProfile);
router.put('/me/profile', protect, isVendor, validate(updateVendorProfileSchema), vendorController.updateMyVendorProfile);
router.post('/me/document', protect, isVendor, upload.single('document'), vendorController.uploadVerificationDocument);
router.get('/me/earnings', protect, isVendor, vendorController.getVendorEarnings);
router.get('/:id', vendorController.getVendor);

export default router;
