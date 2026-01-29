import { generateText } from "ai";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";

export const demoGenerate = inngest.createFunction(
    { id: "demo-generate" },
    { event: "demo/generate" },
    async ({ event, step }) => {
        const { prompt } = event.data;
        
        await step.run("generate-text", async () => {
            return await generateText({
                model: google('gemini-3-flash-preview'),
                prompt,
            });
        });
  },
);