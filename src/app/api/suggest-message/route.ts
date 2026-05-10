import { GoogleGenAI } from "@google/genai";

export const runtime = 'edge';
const ai = new GoogleGenAI({ apiKey: process.env.apiKey });


export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by || . These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents:prompt,
    });
    // for await (const chunk of result) {
    //   console.log(chunk.text);
    // }
    const response = result.text?.split("||")
    // console.log(response)
    return Response.json({
      response
    },{status:200});
  } catch (error) {
      // General error handling
      console.error('An unexpected error occurred:', error);
      throw error;
  }
}