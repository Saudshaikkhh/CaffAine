'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Sparkles,
    Coffee,
    Flame,
    Snowflake,
    IceCream,
    ArrowRight,
    RefreshCcw,
    User,
    Bot
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    product?: any;
    timestamp: Date;
}

const categoryIcons: Record<string, any> = {
    HOT: Flame,
    COLD: Snowflake,
    DESSERT: IceCream,
};

const categoryColors: Record<string, string> = {
    HOT: 'from-orange-500 to-red-500',
    COLD: 'from-cyan-500 to-blue-500',
    DESSERT: 'from-pink-500 to-purple-500',
};

export default function ChatBaristaPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello there, friend. I'm your CaffAIne Barista. I'm not just here to brew coffee, but to listen. How are you honestly feeling today? Please, take your time—I'm here for you.",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3001/ai/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood: input }),
            });
            const data = await res.json();

            // Simulate typing for realism and empathy
            setTimeout(() => {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: data.message || "I'm here for you, and I've found a brew that I think will help.",
                    sender: 'bot',
                    product: data.product,
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, botMsg]);
                setLoading(false);
            }, 1500);

        } catch (error) {
            console.error('Chat error:', error);
            setTimeout(() => {
                const errorMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "I'm so sorry, I seemed to have dropped my beans for a second! Could you say that again? I really want to hear what's on your mind.",
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, errorMsg]);
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 flex flex-col items-center">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10 px-6"
            >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 mb-4">
                    <Sparkles size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Always Listening</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                    The <span className="text-orange-500">AI Barista</span>
                </h1>
                <p className="text-zinc-500 text-lg max-w-xl mx-auto leading-relaxed">
                    Describe your mood, your day, or just say hello. I'll curate your experience.
                </p>
            </motion.div>

            {/* Chat Container */}
            <div className="container max-w-4xl px-4 flex-1 flex flex-col">
                <div
                    ref={scrollRef}
                    className="flex-1 bg-zinc-900/50 border border-white/5 rounded-[3rem] p-6 mb-6 overflow-y-auto min-h-[500px] max-h-[600px] custom-scrollbar space-y-6"
                >
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={cn(
                                    "flex gap-4",
                                    msg.sender === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {/* Avatar */}
                                <div className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg",
                                    msg.sender === 'user' ? "bg-zinc-800 text-zinc-400" : "bg-orange-500 text-white"
                                )}>
                                    {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </div>

                                {/* Bubble */}
                                <div className={cn(
                                    "max-w-[80%] space-y-4",
                                    msg.sender === 'user' ? "text-right items-end" : "text-left items-start"
                                )}>
                                    <div className={cn(
                                        "p-5 rounded-3xl text-sm leading-relaxed",
                                        msg.sender === 'user'
                                            ? "bg-white text-black font-medium rounded-tr-none shadow-xl"
                                            : "bg-zinc-800 text-zinc-300 rounded-tl-none border border-white/5"
                                    )}>
                                        {msg.text}
                                    </div>

                                    {/* Product Recommendation Card Card */}
                                    {msg.product && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="bg-zinc-900 border border-white/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                                                <Sparkles size={60} />
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                                <div className={cn(
                                                    "w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg",
                                                    categoryColors[msg.product.category] || 'from-zinc-700 to-zinc-800'
                                                )}>
                                                    {(() => {
                                                        const Icon = categoryIcons[msg.product.category] || Coffee;
                                                        return <Icon size={32} className="text-white" />;
                                                    })()}
                                                </div>

                                                <div className="flex-1 text-center sm:text-left">
                                                    <h4 className="text-lg font-black text-white mb-1">{msg.product.name}</h4>
                                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-4">{msg.product.category}</p>

                                                    <div className="flex items-center justify-center sm:justify-between gap-4">
                                                        <span className="text-xl font-black text-white">${msg.product.price}</span>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => addToCart(msg.product)}
                                                            className="h-10 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                                                        >
                                                            Add to Cart
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                                <Bot size={20} />
                            </div>
                            <div className="bg-zinc-800/50 p-4 rounded-3xl rounded-tl-none border border-white/5 flex gap-1">
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-600 rounded-[2.5rem] opacity-20 blur group-focus-within:opacity-40 transition-opacity" />
                    <div className="relative flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-[2.5rem] p-2 pr-4 shadow-3xl">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="I'm feeling a bit tired after a long day..."
                            className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-white placeholder-zinc-600 font-medium"
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="w-12 h-12 rounded-[1.5rem] bg-white text-black hover:bg-zinc-200 p-0 flex items-center justify-center transition-all active:scale-90"
                        >
                            <Send size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
