import { z } from 'zod';

export const createServiceSchema = z.object({
  categoryId: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  durationMin: z.number().int().positive().default(60),
  imageUrl: z.string().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();
