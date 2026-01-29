// localhost:3000/src/app/api/demo/blocking/route.ts

import { google } from '@ai-sdk/google';
import { generateText } from "ai"

export async function POST() {
    const response = await generateText({
        model: google('gemini-3-flash'),
        prompt: "Write a short poem about the beauty of nature.",
    }); 

    return Response.json( {response})
}