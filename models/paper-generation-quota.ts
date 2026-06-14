import { Schema, model, models } from 'mongoose'

const paperGenerationQuotaSchema = new Schema(
  {
    _id: { type: String, required: true },
    count: { type: Number, required: true, min: 0, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  {
    collection: 'paper_generation_quotas',
    timestamps: true,
  },
)

paperGenerationQuotaSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: 'quota_expiry' },
)

export const PaperGenerationQuotaModel =
  models.PaperGenerationQuota ??
  model('PaperGenerationQuota', paperGenerationQuotaSchema)
