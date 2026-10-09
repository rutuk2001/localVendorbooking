import { z } from 'zod';

export const createBookingSchema = z.object({
  vendorId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledDate: z.string().datetime().or(z.string().min(1)),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']),
});

export const rescheduleBookingSchema = z.object({
  scheduledDate: z.string().min(1),
});
