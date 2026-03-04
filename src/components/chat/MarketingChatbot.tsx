'use client'

import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Loader2, Trash2 } from 'lucide-react'
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
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(1)
                })
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

    const resetChat = () => {
        setMessages([{ role: 'bot', content: '대화 기록이 초기화되었습니다. 새로운 질문을 입력해주세요.' }])
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <Card className="w-[380px] sm:w-[420px] h-[600px] flex flex-col shadow-2xl shadow-primary/10 border border-primary/10 rounded-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in zoom-in-95 duration-300">
                    <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-10 space-y-0">
                        <CardTitle className="flex items-center gap-2 text-base font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            AI Insight Bot
                        </CardTitle>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={resetChat} title="대화 초기화">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden bg-slate-50/50 dark:bg-slate-900/20">
                        <ScrollArea className="h-full px-4 py-6">
                            <div className="flex flex-col gap-6">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white dark:bg-slate-800 border border-primary/10 text-primary'}`}>
                                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                        </div>
                                        <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-[0.925rem] shadow-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground rounded-tr-sm'
                                                : 'bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-tl-sm text-slate-700 dark:text-slate-300'
                                            }`}>
                                            <div className="break-words space-y-3">
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ node, ...props }) => <p className="last:mb-0" {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1.5 marker:text-primary/50" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1.5 marker:text-primary/50" {...props} />,
                                                        li: ({ node, ...props }) => <li className="" {...props} />
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 flex-row animate-in fade-in duration-300">
                                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-primary/10 text-primary shrink-0 shadow-sm">
                                            <Bot className="w-5 h-5" />
                                        </div>
                                        <div className="px-4 py-4 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center">
                                            <div className="flex gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} className="h-2" />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-4 border-t bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-10">
                        <form
                            className="flex w-full gap-2 items-end relative"
                            onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSend(); }}
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="무엇이든 물어보세요..."
                                className="flex-1 rounded-full pl-5 pr-12 py-6 bg-slate-100/50 dark:bg-slate-900/50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all text-[0.95rem]"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-1.5 bottom-1.5 rounded-full w-9 h-9 shadow-md bg-gradient-to-tr from-primary to-primary/80 hover:shadow-lg hover:scale-105 transition-all duration-200"
                                disabled={isLoading || !input.trim()}
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            ) : (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl shadow-primary/20 hover:shadow-primary/40 bg-gradient-to-tr from-primary to-blue-600 hover:scale-110 transition-all duration-300 group"
                >
                    <MessageSquare className="w-6 h-6 text-white group-hover:scale-95 transition-transform" />
                </Button>
            )}
        </div>
    )
}
