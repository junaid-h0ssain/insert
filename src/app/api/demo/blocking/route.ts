// localhost:3000/src/app/api/demo/blocking/route.ts

import { inngest } from '@/inngest/client';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from "ai"

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST() {
    await inngest.send({
        name: "demo/generate",
        data: {}, 
    }); 

    return Response.json({status: "started"})
}