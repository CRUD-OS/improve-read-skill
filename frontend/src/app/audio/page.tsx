"use client";

import { useState } from "react";
import { useTranscribeAudioMutation } from "../../../graphql/generated";

const mimeType = "audio/webm;codecs=opus"; // Chrome-д тогтвортой

export default function TranscriptionPage() {
  const [permission, setPermission] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [transcriptResult, setTranscriptResult] = useState<{
    text: string;
    isCorrect: boolean;
  } | null>(null);

  const [transcribeAudio, { loading: mutationLoading }] =
    useTranscribeAudioMutation();

  const startRecording = async () => {
    setTranscriptResult(null);
    try {
      const mediaStream: MediaStream =
        await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission(true);
      setStream(mediaStream);

      const mediaRecorder: MediaRecorder = new MediaRecorder(mediaStream, {
        mimeType,
      });

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };

      mediaRecorder.onstop = async () => {
        setLoading(true);
        const audioBlob: Blob = new Blob(audioChunks, { type: mimeType });
        setAudioChunks([]);

        // Browser-д Base64 болгох
        const base64data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]); // data:audio/webm;base64,XXXX -> XXXX
          };
          reader.onerror = reject;
        });

        try {
          const { data } = await transcribeAudio({
            variables: {
              userId: "68c7a0a49f6ae7515b7f0508",
              bookId: "68c7a4a33571925f591602ea",
              audioBase64: base64data,
            },
          });

          if (data?.transcribeAudio) {
            setTranscriptResult({
              text: data.transcribeAudio.text,
              isCorrect: data.transcribeAudio.isCorrect ?? true, // Backend-д isCorrect байхгүй бол default true
            });
          }
        } catch (error) {
          console.error("GraphQL мутацийн алдаа:", error);
          alert("Транскрипци хийхэд алдаа гарлаа.");
        } finally {
          setLoading(false);
        }
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
    } catch (err) {
      alert("Микрофонд хандах зөвшөөрөл олгоно уу.");
    }
  };

  const stopRecording = () => {
    if (recorder && isRecording) {
      recorder.stop();
      stream?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Яриаг текст болгох
      </h1>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-6 py-3 rounded-full text-white font-semibold transition-colors ${
          isRecording
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={loading || mutationLoading}
      >
        {loading || mutationLoading
          ? "Хувиргаж байна..."
          : isRecording
          ? "Бичлэгийг зогсоох"
          : "Ярьж эхлэх"}
      </button>

      {transcriptResult && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Хувиргасан текст:
          </h2>
          <p className="text-gray-700">{transcriptResult.text}</p>
          <div className="mt-4">
            <span
              className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${
                transcriptResult.isCorrect ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {transcriptResult.isCorrect ? "Зөв хариулсан" : "Буруу хариулсан"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
