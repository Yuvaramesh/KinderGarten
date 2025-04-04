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
    The image will be provided for you and it has a reference row of letters at the top and the student's letters below.

    Your Task:
    - Compare each letter to its reference, checking alignment, shape, and correct formation.
    - Provide only the step-by-step corrections for each deviation and conclude with an encouraging summary.
    - Do not analyze or explain the steps; just list the corrections and end with motivational feedback.
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
