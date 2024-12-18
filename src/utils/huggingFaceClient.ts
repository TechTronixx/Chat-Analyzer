import { OpenAI } from "openai";

// create a singleton instance of the hugging face client
export const huggingFaceClient = new OpenAI({
  baseURL: "https://api-inference.huggingface.co/v1/",
  apiKey: import.meta.env.VITE_HUGGING_FACE_API_KEY || "",
});
