"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, SendHorizontal, Sparkles } from "lucide-react"

type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export default function AiChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [model, setModel] = useState("gemini-3-flash-preview")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch('/api/demo/blocking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model,
                    prompt: input.trim()
                })
            })

            if (!response.ok) {
                throw new Error('Failed to send message')
            }

            const data = await response.json()
            
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.text || "No response generated.",
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Sorry, there was an error processing your request.",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
            <Card className="flex-1 flex flex-col shadow-lg">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-5 text-primary" />
                            <CardTitle>AI Chat</CardTitle>
                        </div>
                        <Select value={model} onValueChange={setModel}>
                            <SelectTrigger className="w-60">
                                <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gemini-3-flash-preview">Gemini 3.0 Flash (Preview)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <CardDescription>
                        Powered by Google Gemini via Inngest
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <Sparkles className="size-12 text-muted-foreground/50 mb-4" />
                                    <p className="text-muted-foreground text-lg font-medium">
                                        Start a conversation
                                    </p>
                                    <p className="text-muted-foreground/70 text-sm mt-2">
                                        Type a message to chat with AI
                                    </p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === "user"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap wrap-break-word">
                                                {message.content}
                                            </p>
                                            <p
                                                className={`text-xs mt-1 ${message.role === "user"
                                                        ? "text-primary-foreground/70"
                                                        : "text-muted-foreground"
                                                    }`}
                                            >
                                                {message.timestamp.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    <div className="border-t p-4">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="flex-1"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                size="icon"
                            >
                                {isLoading ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <SendHorizontal className="size-4" />
                                )}
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
