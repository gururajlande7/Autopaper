import mongoose from 'mongoose'
import { getServerEnv } from '@/lib/server/env'

type MongooseCache = {
  connection: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var __mongooseCache: MongooseCache | undefined
}

const cache = global.__mongooseCache ?? {
  connection: null,
  promise: null,
}

global.__mongooseCache = cache

export async function connectToDatabase() {
  if (cache.connection && mongoose.connection.readyState === 1) {
    return cache.connection
  }

  if (!cache.promise) {
    mongoose.set('strictQuery', true)
    const { MONGODB_URI } = getServerEnv()

    cache.promise = mongoose.connect(MONGODB_URI, {
      autoIndex: false,
      bufferCommands: false,
      connectTimeoutMS: 8_000,
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 8_000,
      socketTimeoutMS: 15_000,
    })
  }

  try {
    cache.connection = await cache.promise
    return cache.connection
  } catch (error) {
    cache.promise = null
    throw error
  }
}
