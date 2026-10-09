import { Router } from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { isCustomer } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { createReviewSchema } from '../validators/reviewValidators.js';

const router = Router();

router.post('/', protect, isCustomer, validate(createReviewSchema), reviewController.createReview);
router.get('/vendor/:vendorId', reviewController.getVendorReviews);

export default router;
