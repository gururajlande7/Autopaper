import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI

if (!uri) {
  console.error('MONGODB_URI is required.')
  process.exit(1)
}

try {
  await mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10_000,
  })

  const collection = mongoose.connection.collection('questions')
  await collection.createIndex(
    { subject: 1, chapter: 1, questionType: 1, difficulty: 1 },
    { name: 'subject_chapter_type_difficulty' },
  )

  const quotaCollection = mongoose.connection.collection(
    'paper_generation_quotas',
  )
  await quotaCollection.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, name: 'quota_expiry' },
  )

  console.log('Question and daily quota indexes are ready.')
} finally {
  await mongoose.disconnect()
}
