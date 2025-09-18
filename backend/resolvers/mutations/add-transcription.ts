import { Transcription } from "../../models/transcription-model";
import { Book } from "../../models/book-model";
import { transcribeChimege } from "../../utils/add-chimege";

export const transcribeAudio = async (
  _: unknown,
  args: {
    userId: string;
    bookId: string;
    audioBase64: string; // WebM Base64
  }
) => {
  const { userId, bookId, audioBase64 } = args;

  const book = await Book.findById(bookId);
  if (!book) throw new Error("book not exist");

  // Base64 → Buffer (memory-д шууд)
  const audioBuffer = Buffer.from(audioBase64, "base64");

  const base64String = audioBuffer.toString("base64");

  // Chimege API-д шууд дамжуулах
  const transcribedText = await transcribeChimege(base64String);

  const newTranscription = await Transcription.create({
    userId,
    bookId,
    text: transcribedText,
  });

  return newTranscription;
};
