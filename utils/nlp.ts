import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_AI_API_KEY");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

//used google instead of openAI because it's free 😅
const chatModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

//WARNING: Do not import from client components, will expose API key
export async function prompt(prompt: string | string[]) {
  try {
    const res = await chatModel.generateContent(prompt);
    return res.response.text();
  } catch (e) {
    return "";
  }
}
