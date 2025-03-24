import { Ollama } from "ollama";

const ollama = new Ollama({ host: "http://127.0.0.1:11434" });
export const GenerateText = async (base64: string) => {
  return await ollama.chat({
    model: "llama3.2-vision",
    messages: [
      {
        role: "user",
        content: `You are a handwriting evaluator for kindergarten students.
                    The image will be provided for you and it has a reference row of letters at the top and the student's letters below.

                    Your Task :
                    
                    - Compare each letter to its reference, checking alignment, shape, and correct formation. 
                    - Provide only the step-by-step corrections for each deviation and conclude with an encouraging summary. 
                    - Do not analyze or explain the steps; just list the corrections and end with motivational feedback.
`,
        images: [base64],
      },
    ],
  });
};
