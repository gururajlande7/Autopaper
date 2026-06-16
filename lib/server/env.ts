import 'server-only'
import { z } from 'zod'

const serverEnvSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, 'MONGODB_URI is required.')
    .refine(
      (value) =>
        value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'),
      'MONGODB_URI must be a valid MongoDB connection string.',
    ),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must contain at least 32 characters.'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a URL.'),
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required.'),
  SMTP_PORT: z.coerce
    .number()
    .int('SMTP_PORT must be a whole number.')
    .positive('SMTP_PORT must be positive.'),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true'),
  SMTP_USER: z.string().email('SMTP_USER must be a valid email address.'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS is required.'),
  EMAIL_FROM: z.string().min(3, 'EMAIL_FROM is required.'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
})

type ServerEnv = z.infer<typeof serverEnvSchema>

let cachedEnv: ServerEnv | undefined

export function getServerEnv() {
  if (cachedEnv) {
    return cachedEnv
  }

  const parsed = serverEnvSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE ?? 'true',
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,
    NODE_ENV: process.env.NODE_ENV,
  })

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ')

    throw new Error(`Invalid server environment: ${details}`)
  }

  cachedEnv = parsed.data
  return cachedEnv
}
