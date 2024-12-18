import { OpenAI } from "openai";
import { type Message } from "./chatParser";

// environment variable validation
const validateEnvVariables = () => {
  const requiredVars = [
    "VITE_HUGGING_FACE_API_KEY",
    "VITE_HUGGING_FACE_BASE_URL",
  ];

  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
};

// validate environment variables before creating client
validateEnvVariables();

// create openai client with environment variables
const client = new OpenAI({
  baseURL: import.meta.env.VITE_HUGGING_FACE_BASE_URL,
  apiKey: import.meta.env.VITE_HUGGING_FACE_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface AIAnalysis {
  themes: string[];
  patterns: string[];
  insights: string[];
}

export const analyzeChat = async (messages: Message[]): Promise<AIAnalysis> => {
  try {
    const messageText = messages
      .map((m) => `${m.sender}: ${m.content}`)
      .join("\n");

    // using huggingface inference api format
    const response = await client.chat.completions.create({
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      messages: [
        {
          role: "system",
          content:
            "Analyze this WhatsApp chat and provide insights about: 1. Main themes discussed 2. Communication patterns 3. Key insights. Format as JSON with keys: themes (array), patterns (array), insights (array)",
        },
        {
          role: "user",
          content: messageText,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // parse the response and handle potential format differences
    let analysis;
    try {
      analysis = JSON.parse(
        response.choices[0].message.content ||
          '{"themes":[],"patterns":[],"insights":[]}'
      );
    } catch (parseError) {
      // fallback in case response isn't proper json
      console.warn("Failed to parse AI response as JSON:", parseError);
      const content = response.choices[0].message.content || "";
      analysis = {
        themes: [content],
        patterns: [],
        insights: [],
      };
    }

    return analysis as AIAnalysis;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      themes: [],
      patterns: [],
      insights: [],
    };
  }
};

export { client };
