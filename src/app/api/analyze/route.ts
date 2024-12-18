import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const huggingFaceClient = new OpenAI({
  baseURL: "https://api-inference.huggingface.co/v1/",
  apiKey: process.env.HUGGING_FACE_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const chatContent = messages
      .map((msg: any) => `${msg.sender}: ${msg.content}`)
      .join("\n");

    const prompt = `Analyze this WhatsApp chat conversation and provide:
    1. A brief summary
    2. Main topics discussed
    3. Overall sentiment
    4. Suggestions for better communication

    Chat content:
    ${chatContent}`;

    const completion = await huggingFaceClient.chat.completions.create({
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant that analyzes chat conversations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    const analysis = {
      summary: response.split("Summary:")[1]?.split("\n")[0]?.trim() || "",
      topTopics:
        response
          .split("Topics:")[1]
          ?.split("\n")[0]
          ?.split(",")
          .map((t) => t.trim()) || [],
      sentiment: response.split("Sentiment:")[1]?.split("\n")[0]?.trim() || "",
      suggestions:
        response
          .split("Suggestions:")[1]
          ?.split("\n")
          .filter(Boolean)
          .map((s) => s.trim()) || [],
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze chat content" },
      { status: 500 }
    );
  }
}
