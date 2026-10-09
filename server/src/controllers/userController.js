import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { success, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { ...(name && { name }), ...(phone && { phone }) },
  });
  const { password, ...safe } = user;
  return success(res, 200, 'Profile updated', safe);
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  const avatarUrl = req.file.path || `/uploads/${req.file.filename}`;
  const user = await prisma.user.update({ where: { id: req.user.id }, data: { avatarUrl } });
  const { password, ...safe } = user;
  return success(res, 200, 'Avatar uploaded', safe);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });

  return success(res, 200, 'Password changed successfully');
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { vendorId } = req.body;
  const item = await prisma.wishlist.upsert({
    where: { userId_vendorId: { userId: req.user.id, vendorId } },
    update: {},
    create: { userId: req.user.id, vendorId },
  });
  return success(res, 201, 'Added to wishlist', item);
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  await prisma.wishlist.deleteMany({ where: { userId: req.user.id, vendorId: req.params.vendorId } });
  return success(res, 200, 'Removed from wishlist');
});

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await prisma.wishlist.findMany({
    where: { userId: req.user.id },
    include: { vendor: { include: { user: { select: { name: true, avatarUrl: true } } } } },
  });
  return success(res, 200, 'Wishlist fetched', wishlist);
});

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return success(res, 200, 'Notifications fetched', notifications);
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
  return success(res, 200, 'Notification marked as read');
});
