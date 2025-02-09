import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDkqkXVXqkMJ7aegzT-WPpy4Qo1tjzqwYs");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const sendImageToGemini = async (base64Image: string) => {
  const prompt =
    "tell me about this image. what do you see in this image?. find the alphabets in the image, the first row contain alphets letters find it";

  // Convert Base64 to the format expected by Gemini AI

  const result = await model.generateContent([prompt, base64Image]);
  const response = await result.response;
  return response.text();
};
