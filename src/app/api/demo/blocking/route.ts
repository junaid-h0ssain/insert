// localhost:3000/src/app/api/demo/blocking/route.ts

import { inngest } from '@/inngest/client';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createCerebras } from '@ai-sdk/cerebras';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from "ai"

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const cerebras = createCerebras({
    apiKey: process.env.CEREBRAS_API_KEY!,
});

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: Request) {
    const { model, prompt } = await request.json();
    
    try {
        // Send to Inngest for background processing (optional)
        await inngest.send({
            name: "demo/generate",
            data: {
                model,
                prompt,
            }, 
        });
        
        // Determine which provider to use based on model name
        let selectedModel;
        
        if (model.startsWith('llama') || model.startsWith('qwen') || model.startsWith('zai-glm')) {
            selectedModel = cerebras(model);
        } else if (model.startsWith('gemma') || model.startsWith('mixtral') || 
                   model.startsWith('deepseek') || model.includes('llama-3') || 
                   model.includes('llama-4') || model.includes('llama-guard') ||
                   model.includes('moonshotai') || model.includes('qwen-') ||
                   model.startsWith('openai/gpt-oss') || model.startsWith('meta-llama')) {
            selectedModel = groq(model);
        } else {
            selectedModel = google(model);
        }
        
        // Generate directly for immediate response
        const result = await generateText({
            model: selectedModel,
            prompt,
        });

        return Response.json({ 
            status: "success",
            text: result.text 
        });
    } catch (error) {
        console.error('Error generating text:', error);
        return Response.json(
            { status: "error", message: "Failed to generate text" },
            { status: 500 }
        );
    }
}