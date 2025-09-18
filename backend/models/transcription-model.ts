import { model, Schema, models, Model } from "mongoose";
import type { ComputerScreenshotContent } from "openai/resources/conversations/conversations.mjs";
type Transcription = {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  bookId: Schema.Types.ObjectId;
  text: String;
  wordCount: number;
  duration: number;
  isCorrect: boolean;
};
const TranscriptionSchema = new Schema<Transcription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: " User",
    },
    bookId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Book", // 'Book' гэсэн цуглуулгатай холбоно.
    },
    text: {
      type: String,
      required: true,
    },
    wordCount: {
      type: Number,
      required: true,
      default: 0,
    },
    duration: {
      type: Number,
      required: true,
      default: 0,
    },
    isCorrect: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
export const Transcription: Model<Transcription> = 
models.transcription || model<Transcription>("Transcription", TranscriptionSchema);
