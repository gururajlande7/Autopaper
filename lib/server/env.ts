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
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required.'),
  EMAIL_FROM: z.string().min(3, 'EMAIL_FROM is required.'),
  EMAIL_TEST_RECIPIENT: z
    .string()
    .email('EMAIL_TEST_RECIPIENT must be a valid email address.')
    .optional(),
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
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_TEST_RECIPIENT:
      process.env.EMAIL_TEST_RECIPIENT || undefined,
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
