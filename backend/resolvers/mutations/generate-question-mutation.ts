import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuestions = async (
  _: unknown,
  { chapter }: { chapter: string }
) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    if (!chapter || chapter.trim() === "") {
      throw new Error("Текст хоосон байна");
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Чи боловсролын салбарын AI туслах. Чиний зорилго бол сурагчийн уншсан эхийг ойлгосон эсэхийг шалгах **асуулт** бэлтгэх юм.

Хэрэглэгчийн өгсөн текст дээр үндэслэн дараах шаардлагыг хангах **3-5 асуулт** боловсруул:

1. **Агуулгын тухай асуулт** — гол санаа, юу болсон талаар.
2. **Шалтгаан, үр дагаврын асуулт** — яагаад ийм зүйл болсон тухай.
3. **Дүгнэлт хийх, өөрийн байр суурь илэрхийлэх асуулт** — сурагч юу гэж бодож байгаа эсэхийг шалгах.
4. **Үг хэллэг, өгүүлбэрийн утга тайлбарлах асуулт** (хэрвээ тохиромжтой бол).

👉 Асуулт бүрийн дараа товч, ойлгомжтой **тайлбар** нэмээрэй.  
👉 Асуултууд нь насанд тохирсон, боловсролын зорилготой, энгийн ойлгомжтой байх ёстой.  
👉 Гарчиг, оршил хэрэггүй. Зөвхөн асуултууд болон тайлбаруудыг жагсаалтаар буцаа.

Жишээ формат:
1. [Асуулт?]  
   - Тайлбар: [Яагаад энэ асуулт чухал вэ гэх мэт...]
`,
        },
        {
          role: "user",
          content: chapter,
        },
      ],
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) throw new Error("AI-гаас хоосон хариу ирсэн байна");

    const questions = result
      .split("\n")
      .map((q) => q.trim().replace(/^\d+\.\s*/, ""))
      .filter((q) => q.length > 0);

    return questions;
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    throw new Error(error.message || "Асуулт үүсгэхэд алдаа гарлаа");
  }
};
