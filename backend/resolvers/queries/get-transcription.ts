// resolvers/query.ts

import { Transcription } from "../../models/transcription-model";

export const getTranscription = {
  transcriptions: async (_: unknown, { userId }: { userId: string }) => {
    // userId-аар шүүлт хийж, бүх транскрипцийг эрэмбэлж буцаана.
    // .sort({ createdAt: -1 }) нь хамгийн сүүлийнхийг эхэнд нь харуулах зорилготой.
    const transcriptions = await Transcription.find({ userId: userId }).sort({
      createdAt: -1,
    });
    return transcriptions;
  },

  transcription: async (_: unknown, { id }: { id: string }) => {
    // Тодорхой ID-тай транскрипцийг олох.
    const transcription = await Transcription.findById(id);
    if (!transcription) {
      throw new Error("Транскрипци олдсонгүй.");
    }
    return transcription;
  },
};
