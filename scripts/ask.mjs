import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const result = await generateText({
  model: google("gemini-3.5-flash-lite"),
  instructions:
    "You are ShopBuddy, the friendly support assistant fro Gadget Hub, a small gadget online shop. Keep your answer small and helpful.",
  prompt: "Hi! What can you help me with?",
});

console.log(result.text);
console.log(result.usage);
