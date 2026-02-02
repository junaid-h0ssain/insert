/* eslint-disable @typescript-eslint/no-explicit-any */
import { inngest } from '@/inngest/client';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createCerebras } from '@ai-sdk/cerebras';
import { createGroq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages } from "ai"
import type { UIMessage } from "ai";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const cerebras = createCerebras({
    apiKey: process.env.CEREBRAS_API_KEY!,
});

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!,
});

export const maxDuration = 30;

export async function POST(request: Request) {
    const { messages, data }: { messages: UIMessage[], data?: any } = await request.json();

    if (!Array.isArray(messages)) {
        return Response.json(
            { status: "error", message: "Messages must be an array" },
            { status: 400 }
        );
    }

    const model = data?.model || 'gemini-3-flash-preview';

    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage?.role === 'user'
        ? lastMessage.parts
            .filter(p => p.type === 'text')
            .map(p => p.text)
            .join('')
        : '';

    try {
        // Send to Inngest for background processing (optional)
        if (prompt) {
            try {
                await inngest.send({
                    name: "demo/generate",
                    data: {
                        model,
                        prompt,
                    },
                });
            } catch (inngestError) {
                console.warn('Inngest event send failed:', inngestError);
            }
        }

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

        const result = streamText({
            model: selectedModel,
            messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        console.error('Error generating text:', error);
        return Response.json(
            {
                status: "error",
                message: "Failed to generate text",
                details: error?.message || String(error)
            },
            { status: 500 }
        );
    }
}