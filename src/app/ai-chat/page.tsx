"use client"

import { useState } from "react"
import { Thread } from "@/components/assistant-ui/thread"
import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles } from "lucide-react"

export default function AiChatPage() {
    const [model, setModel] = useState("gemini-3-flash-preview")

    const runtime = useChatRuntime({
        transport: new AssistantChatTransport({
            api: "/api/chat",
            body: {
                data: { model }
            }
        })
    })

    return (
        <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
            <Card className="flex-1 flex flex-col shadow-lg overflow-hidden">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-5 text-primary" />
                            <CardTitle>AI Chat</CardTitle>
                        </div>
                        <Select value={model} onValueChange={setModel}>
                            <SelectTrigger className="size-fit min-w-60">
                                <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="zai-glm-4.7">Cerebras: GLM-4.7</SelectItem>
                                <SelectItem value="gemini-3-flash-preview">Google: Gemini 3 Flash</SelectItem>
                                <SelectItem value="moonshotai/kimi-k2-instruct-0905">Groq: Kimi K2 Instruct 0905</SelectItem>
                                <SelectItem value="deepseek-r1-distill-llama-70b">Groq: DeepSeek R1 70B</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <CardDescription>
                        Powered by Groq, Cerebras & Google Gemini
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                    <AssistantRuntimeProvider runtime={runtime}>
                        <Thread />
                    </AssistantRuntimeProvider>
                </CardContent>
            </Card>
        </div>
    )
}
