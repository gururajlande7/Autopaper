import { Schema, model, models } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    emailVerifiedAt: Date,
    emailVerificationTokenHash: { type: String, select: false },
    emailVerificationExpiresAt: { type: Date, select: false },
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpiresAt: { type: Date, select: false },
    sessionVersion: { type: Number, required: true, default: 0 },
    lastLoginAt: Date,
  },
  {
    collection: 'users',
    timestamps: true,
  },
)

userSchema.index(
  { emailVerificationTokenHash: 1 },
  { unique: true, sparse: true, name: 'email_verification_token' },
)
userSchema.index(
  { passwordResetTokenHash: 1 },
  { unique: true, sparse: true, name: 'password_reset_token' },
)

export const UserModel = models.User ?? model('User', userSchema)
