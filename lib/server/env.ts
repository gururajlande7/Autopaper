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
