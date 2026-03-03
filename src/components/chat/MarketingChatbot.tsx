'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
    role: 'user' | 'bot'
    content: string
}

export function MarketingChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: '안녕하세요! 마케팅 AI 어시스턴트입니다. 캠페인 성과나 예산 최적화에 대해 무엇이든 물어보세요.' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            })

            if (!res.ok) throw new Error('API Error')

            const data = await res.json()
            setMessages(prev => [...prev, { role: 'bot', content: data.reply }])
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: 'bot', content: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <Card className="w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <Bot className="w-5 h-5 text-primary" />
                            AI Insight Bot
                        </CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                            <div className="flex flex-col gap-4 pb-4">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-2 flex-row">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted shrink-0">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="px-3 py-2 rounded-lg bg-muted rounded-tl-none flex items-center">
                                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mr-2" />
                                            <span className="text-xs text-muted-foreground">분석 중...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-4 border-t bg-background/50 backdrop-blur">
                        <form
                            className="flex w-full gap-2"
                            onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSend(); }}
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="질문을 입력하세요..."
                                className="flex-1"
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            ) : (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                >
                    <MessageSquare className="w-6 h-6 group-hover:animate-pulse" />
                </Button>
            )}
        </div>
    )
}
