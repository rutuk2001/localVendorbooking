import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';

const router = Router();

router.use(protect, isAdmin);
router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.listUsers);
router.put('/users/:id/toggle-active', adminController.toggleUserActive);
router.get('/vendors/pending', adminController.listPendingVendors);
router.put('/vendors/:id/approve', adminController.approveVendor);
router.put('/vendors/:id/reject', adminController.rejectVendor);
router.get('/bookings', adminController.listAllBookings);
router.get('/payments', adminController.listPayments);
router.get('/complaints', adminController.listComplaints);
router.put('/complaints/:id', adminController.updateComplaintStatus);
router.post('/coupons', adminController.createCoupon);
router.get('/coupons', adminController.listCoupons);
router.delete('/coupons/:id', adminController.deleteCoupon);

export default router;
