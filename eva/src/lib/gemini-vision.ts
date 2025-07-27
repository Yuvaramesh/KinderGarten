import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAm_IEKXeiwfLW3JHuTrgqShT38yvro6QY");

export async function geminiVision(
  prompt: string,
  imageBase64: string,
  language: string
) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const basePrompt = `
   You are a handwriting evaluator for kindergarten students.

You will be given an image containing:
- A top row with printed reference uppercase letters (e.g., A, B, C, D, ...).
- Multiple rows below that show the student's handwritten versions of the same letters.

Your Task:
- Carefully analyze each handwriting row **individually**.
- For **each letter** in a row (A, B, C, D, ...), compare it against the reference letter above.
- Evaluate based on:
  - Shape accuracy
  - Stroke direction and formation
  - Size consistency
  - Line alignment (relative to red and blue writing lines)

Instructions:
- For every letter, list step-by-step corrections to improve it.
- After each row's evaluation, write a short, cheerful, and kind motivational line to encourage the student.
- Avoid any general explanation; just focus on corrections and then encouragement.

Format your output like this:

Row 1:
- A: [corrections...]
- B: [corrections...]
...
Encouragement for Row 1: [your message]

Repeat this for all rows.

  `;

  const languageInstruction =
    language && language !== "en" ? `\n\nPlease respond in ${language}.` : "";

  const finalPrompt = basePrompt + languageInstruction + "\n\n" + prompt;

  const rawBase64 = imageBase64.split(",")[1] || imageBase64; // in case there's no prefix

  const generatedContent = await model.generateContent([
    finalPrompt,
    {
      inlineData: {
        data: rawBase64,
        mimeType: "image/jpeg",
      },
    },
  ]);

  return generatedContent.response.text();
}
