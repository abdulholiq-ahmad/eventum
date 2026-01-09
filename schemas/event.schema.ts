import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  startsAt: z.string().or(z.date()).transform((v) => (typeof v === 'string' ? new Date(v) : v)),
  endsAt: z.string().or(z.date()).transform((v) => (typeof v === 'string' ? new Date(v) : v)),
  timezone: z.string().optional(),
  visibility: z.enum(['public', 'private']).default('public'),
  requiresApproval: z.boolean().default(false),
  capacity: z.number().int().positive().optional(),
  image: z.string().optional(),
  location: z
    .object({
      name: z.string().optional(),
      address: z.string().optional(),
      coords: z.string().optional(),
      link: z.string().url().optional(),
      type: z.enum(['physical', 'online']).optional(),
    })
    .optional(),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
