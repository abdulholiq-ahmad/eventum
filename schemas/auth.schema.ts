import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const credentialsLoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export type CredentialsLoginInput = z.infer<typeof credentialsLoginSchema>;
