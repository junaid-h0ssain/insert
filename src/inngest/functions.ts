import { generateText } from "ai";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";
import { cerebras } from "@ai-sdk/cerebras";
import { groq } from "@ai-sdk/groq";

export const demoGenerate = inngest.createFunction(
    { id: "demo-generate" },
    { event: "demo/generate" },
    async ({ event, step }) => {
        const { model, prompt } = event.data;
        
        await step.run("generate-text", async () => {
            // Determine which provider to use based on model name
            let selectedModel;
            
            if (model.startsWith('llama') || 
                model.startsWith('qwen') || 
                model.startsWith('zai-glm') || 
                model.startsWith('gpt-oss-120b')) {
                selectedModel = cerebras(model);
            } else if ( 
                       model.startsWith('deepseek') || // model.startsWith('openai/gpt-oss-120b') ||
                       model.includes('moonshotai') || model.includes('qwen-')) {
                selectedModel = groq(model);
            } else {
                selectedModel = google(model);
            }
            
            return await generateText({
                model: selectedModel,
                prompt,
            });
        });
  },
);