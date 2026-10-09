import prisma from '../config/db.js';
import { success, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const notify = async (userId, title, message) => {
  await prisma.notification.create({ data: { userId, title, message } });
};

export const createBooking = asyncHandler(async (req, res) => {
  const { vendorId, serviceId, scheduledDate, address, notes } = req.body;

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.isActive) throw new ApiError(404, 'Service not found');
  if (service.vendorId !== vendorId) throw new ApiError(400, 'Service does not belong to this vendor');

  const booking = await prisma.booking.create({
    data: {
      customerId: req.user.id,
      vendorId,
      serviceId,
      scheduledDate: new Date(scheduledDate),
      totalAmount: service.price,
      address,
      notes,
    },
    include: { service: true, vendor: { include: { user: true } } },
  });

  await prisma.payment.create({
    data: { bookingId: booking.id, amount: service.price, status: 'PENDING' },
  });

  await notify(
    booking.vendor.userId,
    'New booking request',
    `You have a new booking request for ${service.title}`
  );

  return success(res, 201, 'Booking created', booking);
});

export const getMyBookingsAsCustomer = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const bookings = await prisma.booking.findMany({
    where: { customerId: req.user.id, ...(status && { status }) },
    include: {
      service: { include: { category: true } },
      vendor: { include: { user: { select: { name: true } } } },
      payment: true,
      review: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return success(res, 200, 'Bookings fetched', bookings);
});

export const getVendorBookings = asyncHandler(async (req, res) => {
  const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
  if (!vendor) throw new ApiError(404, 'Vendor profile not found');

  const { status } = req.query;
  const bookings = await prisma.booking.findMany({
    where: { vendorId: vendor.id, ...(status && { status }) },
    include: {
      service: true,
      customer: { select: { name: true, phone: true, avatarUrl: true } },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return success(res, 200, 'Vendor bookings fetched', bookings);
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: {
      service: { include: { category: true } },
      vendor: { include: { user: { select: { name: true, phone: true } } } },
      customer: { select: { name: true, phone: true, email: true } },
      payment: true,
      review: true,
      invoice: true,
    },
  });
  if (!booking) throw new ApiError(404, 'Booking not found');

  const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
  const isOwnerCustomer = booking.customerId === req.user.id;
  const isOwnerVendor = vendor && booking.vendorId === vendor.id;
  if (!isOwnerCustomer && !isOwnerVendor && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'You do not have access to this booking');
  }

  return success(res, 200, 'Booking fetched', booking);
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!booking) throw new ApiError(404, 'Booking not found');

  const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
  if (req.user.role !== 'ADMIN' && (!vendor || booking.vendorId !== vendor.id)) {
    throw new ApiError(403, 'Only the assigned vendor can update this booking');
  }

  const validTransitions = {
    PENDING: ['ACCEPTED', 'REJECTED'],
    ACCEPTED: ['COMPLETED', 'CANCELLED'],
  };
  if (validTransitions[booking.status] && !validTransitions[booking.status].includes(status)) {
    throw new ApiError(400, `Cannot transition booking from ${booking.status} to ${status}`);
  }

  const updated = await prisma.booking.update({ where: { id: req.params.id }, data: { status } });

  if (status === 'COMPLETED') {
    const invoiceNo = `INV-${Date.now()}`;
    await prisma.invoice.create({ data: { bookingId: booking.id, invoiceNo } });
    await prisma.payment.update({ where: { bookingId: booking.id }, data: { status: 'PAID' } });
  }

  await notify(booking.customerId, 'Booking update', `Your booking status changed to ${status}`);

  return success(res, 200, 'Booking status updated', updated);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.customerId !== req.user.id) throw new ApiError(403, 'You can only cancel your own bookings');
  if (!['PENDING', 'ACCEPTED'].includes(booking.status)) {
    throw new ApiError(400, 'This booking can no longer be cancelled');
  }

  const updated = await prisma.booking.update({ where: { id: req.params.id }, data: { status: 'CANCELLED' } });
  return success(res, 200, 'Booking cancelled', updated);
});

export const rescheduleBooking = asyncHandler(async (req, res) => {
  const { scheduledDate } = req.body;
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.customerId !== req.user.id) throw new ApiError(403, 'You can only reschedule your own bookings');
  if (!['PENDING', 'ACCEPTED'].includes(booking.status)) {
    throw new ApiError(400, 'This booking can no longer be rescheduled');
  }

  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data: { scheduledDate: new Date(scheduledDate), status: 'RESCHEDULED' },
  });
  return success(res, 200, 'Booking rescheduled', updated);
});
