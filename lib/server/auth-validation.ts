import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, 'Password must contain at least 8 characters.')
  .max(128, 'Password is too long.')
  .regex(/[a-z]/, 'Password must include a lowercase letter.')
  .regex(/[A-Z]/, 'Password must include an uppercase letter.')
  .regex(/[0-9]/, 'Password must include a number.')

export const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid email address.')
  .max(254)
  .transform((email) => email.toLowerCase())

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  password: passwordSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
})

export const emailRequestSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  token: z.string().min(20).max(200),
  password: passwordSchema,
})
