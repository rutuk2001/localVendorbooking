import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { isCustomer, isVendorOrAdmin } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import {
  createBookingSchema,
  updateBookingStatusSchema,
  rescheduleBookingSchema,
} from '../validators/bookingValidators.js';

const router = Router();

router.use(protect);
router.post('/', isCustomer, validate(createBookingSchema), bookingController.createBooking);
router.get('/mine', isCustomer, bookingController.getMyBookingsAsCustomer);
router.get('/vendor', isVendorOrAdmin, bookingController.getVendorBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/status', isVendorOrAdmin, validate(updateBookingStatusSchema), bookingController.updateBookingStatus);
router.put('/:id/cancel', isCustomer, bookingController.cancelBooking);
router.put('/:id/reschedule', isCustomer, validate(rescheduleBookingSchema), bookingController.rescheduleBooking);

export default router;
