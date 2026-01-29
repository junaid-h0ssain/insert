// localhost:3000/src/app/api/demo/blocking/route.ts

import { inngest } from '@/inngest/client';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from "ai"

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
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
        
        // Also generate directly for immediate response
        const result = await generateText({
            model: google(model),
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