import prisma from '../config/db.js';
import { success, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listServices = asyncHandler(async (req, res) => {
  const { categoryId, vendorId, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;

  const where = {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(vendorId && { vendorId }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    }),
    ...(search && { title: { contains: search, mode: 'insensitive' } }),
  };

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      include: { category: true, vendor: { include: { user: { select: { name: true } } } } },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.service.count({ where }),
  ]);

  return success(res, 200, 'Services fetched', services, {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

export const getService = asyncHandler(async (req, res) => {
  const service = await prisma.service.findUnique({
    where: { id: req.params.id },
    include: { category: true, vendor: { include: { user: { select: { name: true, avatarUrl: true } } } } },
  });
  if (!service) throw new ApiError(404, 'Service not found');
  return success(res, 200, 'Service fetched', service);
});

export const createService = asyncHandler(async (req, res) => {
  const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
  if (!vendor) throw new ApiError(403, 'Only vendors can create services');

  const service = await prisma.service.create({
    data: { ...req.body, vendorId: vendor.id },
  });
  return success(res, 201, 'Service created', service);
});

export const updateService = asyncHandler(async (req, res) => {
  const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) throw new ApiError(404, 'Service not found');
  if (req.user.role !== 'ADMIN' && service.vendorId !== vendor?.id) {
    throw new ApiError(403, 'You do not own this service');
  }

  const updated = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
  return success(res, 200, 'Service updated', updated);
});

export const deleteService = asyncHandler(async (req, res) => {
  const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) throw new ApiError(404, 'Service not found');
  if (req.user.role !== 'ADMIN' && service.vendorId !== vendor?.id) {
    throw new ApiError(403, 'You do not own this service');
  }

  await prisma.service.update({ where: { id: req.params.id }, data: { isActive: false } });
  return success(res, 200, 'Service deleted');
});
