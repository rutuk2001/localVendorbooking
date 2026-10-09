import { z } from 'zod';

export const updateVendorProfileSchema = z.object({
  businessName: z.string().min(2).optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  workingHours: z.record(z.any()).optional(),
});
