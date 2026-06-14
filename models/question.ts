import { Schema, model, models } from 'mongoose'

const questionSchema = new Schema(
  {
    questionText: { type: String, required: true, trim: true },
    questionType: {
      type: String,
      enum: [
        'MCQ',
        'obj',
        'gr',
        '1m',
        '2m',
        '3m',
        '5m',
        '1a',
        '1b',
        '2a',
        '2b',
        '3a',
        '3b',
        '4',
        '5',
      ],
      required: true,
    },
    options: { type: [String], default: [] },
    subject: {
      type: String,
      enum: [
        'science1',
        'science2',
        'math-1',
        'math-2',
        'Science and Technology - I',
        'Science and Technology - II',
        'Mathematics - I',
        'Mathematics - II',
      ],
      required: true,
      index: true,
    },
    chapter: { type: Number, min: 1, required: true },
    chapterName: { type: String, trim: true },
    grade: { type: Number, min: 1, max: 12, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    marks: { type: Number, min: 1, required: true },
    category: Number,
    createdBy: Schema.Types.ObjectId,
    institutionId: Schema.Types.ObjectId,
    hasImage: {
      type: String,
      enum: ['yes', 'no', 'true', 'false'],
      required: true,
    },
    image: String,
  },
  {
    collection: 'questions',
    timestamps: true,
  },
)

questionSchema.index({
  subject: 1,
  chapter: 1,
  questionType: 1,
  difficulty: 1,
})

export const QuestionModel =
  models.Question ?? model('Question', questionSchema)
