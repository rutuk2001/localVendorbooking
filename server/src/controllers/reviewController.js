import prisma from '../config/db.js';
import { success, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.customerId !== req.user.id) throw new ApiError(403, 'You can only review your own bookings');
  if (booking.status !== 'COMPLETED') throw new ApiError(400, 'You can only review completed bookings');

  const existing = await prisma.review.findUnique({ where: { bookingId } });
  if (existing) throw new ApiError(409, 'This booking has already been reviewed');

  const review = await prisma.review.create({
    data: { bookingId, customerId: req.user.id, vendorId: booking.vendorId, rating, comment },
  });

  const agg = await prisma.review.aggregate({
    where: { vendorId: booking.vendorId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.vendor.update({
    where: { id: booking.vendorId },
    data: { ratingAvg: agg._avg.rating || 0, ratingCount: agg._count.rating },
  });

  return success(res, 201, 'Review submitted', review);
});

export const getVendorReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { vendorId: req.params.vendorId },
    include: { customer: { select: { name: true, avatarUrl: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return success(res, 200, 'Reviews fetched', reviews);
});
