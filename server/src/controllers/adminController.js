import prisma from '../config/db.js';
import { success, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import dayjs from 'dayjs';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalVendors, totalCustomers, pendingVendors, totalBookings, revenueAgg, bookingsByStatus] =
    await Promise.all([
      prisma.user.count(),
      prisma.vendor.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.vendor.count({ where: { isApproved: false } }),
      prisma.booking.count(),
      prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
      prisma.booking.groupBy({ by: ['status'], _count: { status: true } }),
    ]);

  // last 30 days revenue trend, grouped by day
  const since = dayjs().subtract(30, 'day').toDate();
  const payments = await prisma.payment.findMany({
    where: { status: 'PAID', createdAt: { gte: since } },
    select: { amount: true, createdAt: true },
  });
  const revenueByDay = {};
  payments.forEach((p) => {
    const day = dayjs(p.createdAt).format('YYYY-MM-DD');
    revenueByDay[day] = (revenueByDay[day] || 0) + Number(p.amount);
  });
  const revenueTrend = Object.entries(revenueByDay)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  return success(res, 200, 'Dashboard stats fetched', {
    totalUsers,
    totalVendors,
    totalCustomers,
    pendingVendors,
    totalBookings,
    totalRevenue: Number(revenueAgg._sum.amount || 0),
    bookingsByStatus: bookingsByStatus.map((b) => ({ status: b.status, count: b._count.status })),
    revenueTrend,
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const where = {
    ...(role && { role }),
    ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }),
  };
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);
  return success(res, 200, 'Users fetched', users, { total, page: Number(page), limit: Number(limit) });
});

export const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) throw new ApiError(404, 'User not found');
  const updated = await prisma.user.update({ where: { id: req.params.id }, data: { isActive: !user.isActive } });
  return success(res, 200, `User ${updated.isActive ? 'activated' : 'deactivated'}`, { id: updated.id, isActive: updated.isActive });
});

export const listPendingVendors = asyncHandler(async (req, res) => {
  const vendors = await prisma.vendor.findMany({
    where: { isApproved: false },
    include: { user: { select: { name: true, email: true, createdAt: true } } },
  });
  return success(res, 200, 'Pending vendors fetched', vendors);
});

export const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await prisma.vendor.update({
    where: { id: req.params.id },
    data: { isApproved: true, isVerified: true },
  });
  await prisma.notification.create({
    data: { userId: vendor.userId, title: 'Account approved', message: 'Your vendor account has been approved!' },
  });
  return success(res, 200, 'Vendor approved', vendor);
});

export const rejectVendor = asyncHandler(async (req, res) => {
  const vendor = await prisma.vendor.update({
    where: { id: req.params.id },
    data: { isApproved: false, isVerified: false },
  });
  return success(res, 200, 'Vendor rejected', vendor);
});

export const listAllBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const where = { ...(status && { status }) };
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        customer: { select: { name: true, email: true } },
        vendor: { select: { businessName: true } },
        service: { select: { title: true } },
        payment: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.booking.count({ where }),
  ]);
  return success(res, 200, 'Bookings fetched', bookings, { total, page: Number(page), limit: Number(limit) });
});

export const listPayments = asyncHandler(async (req, res) => {
  const payments = await prisma.payment.findMany({
    include: { booking: { include: { customer: { select: { name: true } }, vendor: { select: { businessName: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
  return success(res, 200, 'Payments fetched', payments);
});

export const listComplaints = asyncHandler(async (req, res) => {
  const complaints = await prisma.complaint.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return success(res, 200, 'Complaints fetched', complaints);
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const complaint = await prisma.complaint.update({ where: { id: req.params.id }, data: { status } });
  return success(res, 200, 'Complaint updated', complaint);
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await prisma.coupon.create({ data: req.body });
  return success(res, 201, 'Coupon created', coupon);
});

export const listCoupons = asyncHandler(async (req, res) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return success(res, 200, 'Coupons fetched', coupons);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await prisma.coupon.update({ where: { id: req.params.id }, data: { isActive: false } });
  return success(res, 200, 'Coupon deactivated');
});
