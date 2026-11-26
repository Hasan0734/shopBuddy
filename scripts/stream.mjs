import { google } from "@ai-sdk/google";
import { streamText } from "ai";

const result = streamText({
  model: google("gemini-3.5-flash-lite"),
  prompt:
    "I'm new to gadgets, write a detailed guid to USB-C, Lighing and micro-USB, with example of devices that use each.",
});


for await (const chunk of result.textStream) {
    process.stdout.write(chunk)
}