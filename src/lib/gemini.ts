import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "$env/dynamic/private";

const apiKey = env.GEMINI_API_KEY ?? env.PRIVATE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY (or PRIVATE_GEMINI_API_KEY) in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-flash-latest"   
});

