import prisma from '../config/db.js';
import { success, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listVendors = asyncHandler(async (req, res) => {
  const { city, category, minRating, search, page = 1, limit = 12 } = req.query;

  const where = {
    isApproved: true,
    ...(city && { city: { contains: city, mode: 'insensitive' } }),
    ...(minRating && { ratingAvg: { gte: Number(minRating) } }),
    ...(search && { businessName: { contains: search, mode: 'insensitive' } }),
    ...(category && { services: { some: { categoryId: category } } }),
  };

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      include: {
        user: { select: { name: true, avatarUrl: true } },
        services: { where: { isActive: true }, take: 3, include: { category: true } },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { ratingAvg: 'desc' },
    }),
    prisma.vendor.count({ where }),
  ]);

  return success(res, 200, 'Vendors fetched', vendors, {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

export const getVendor = asyncHandler(async (req, res) => {
  const vendor = await prisma.vendor.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { name: true, avatarUrl: true, email: true } },
      services: { where: { isActive: true }, include: { category: true } },
      reviews: {
        include: { customer: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });
  if (!vendor) throw new ApiError(404, 'Vendor not found');
  return success(res, 200, 'Vendor fetched', vendor);
});

export const getMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await prisma.vendor.findUnique({
    where: { userId: req.user.id },
    include: { services: true, user: { select: { name: true, email: true, avatarUrl: true } } },
  });
  if (!vendor) throw new ApiError(404, 'Vendor profile not found');
  return success(res, 200, 'Vendor profile fetched', vendor);
});

export const updateMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await prisma.vendor.update({
    where: { userId: req.user.id },
    data: req.body,
  });
  return success(res, 200, 'Vendor profile updated', vendor);
});

export const uploadVerificationDocument = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  const fileUrl = req.file.path || `/uploads/${req.file.filename}`;

  const vendor = await prisma.vendor.update({
    where: { userId: req.user.id },
    data: { documentUrl: fileUrl, isVerified: false },
  });
  return success(res, 200, 'Verification document uploaded, pending review', vendor);
});

export const getVendorEarnings = asyncHandler(async (req, res) => {
  const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
  if (!vendor) throw new ApiError(404, 'Vendor profile not found');

  const completedBookings = await prisma.booking.findMany({
    where: { vendorId: vendor.id, status: 'COMPLETED' },
    include: { service: { select: { title: true } } },
    orderBy: { updatedAt: 'desc' },
  });

  const totalEarnings = completedBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);

  return success(res, 200, 'Earnings fetched', {
    totalEarnings,
    completedCount: completedBookings.length,
    bookings: completedBookings,
  });
});
