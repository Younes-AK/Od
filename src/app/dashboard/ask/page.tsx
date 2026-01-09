'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Send, ArrowLeft, Mic } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface AIResponse {
    text: string;
    images: { prompt: string; url: string }[];
}

const AskAI = () => {
    const { language } = useLanguage();
    const { data: session } = useSession();
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', data?: AIResponse, text?: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!question.trim() || loading) return;

        const currentQuestion = question;
        const newMessages = [...messages, { role: 'user' as const, text: currentQuestion }];
        setMessages(newMessages);
        setQuestion('');
        setLoading(true);

        try {
            const res = await fetch('/api/lesson/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: currentQuestion,
                    language: language,
                    age: (session?.user as any)?.age || 10
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessages([...newMessages, {
                    role: 'ai',
                    data: data
                }]);
            } else {
                throw new Error(data.error || 'Failed to get answer');
            }
        } catch (error) {
            console.error('Ask AI Error:', error);
            setMessages([...newMessages, {
                role: 'ai',
                text: language === 'ar' ? 'عذراً، حدث خطأ ما. حاول مرة أخرى!' : "Oops, something went wrong. Please try again!"
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-soft-pink/20 flex flex-col">
            <header className="p-6 border-b-4 border-gray-900 bg-white sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 font-black text-gray-600">
                        <ArrowLeft />
                        {language === 'ar' ? 'العودة للوحة التحكم' : 'Back'}
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🦉</span>
                        <h1 className="text-2xl font-black">{language === 'ar' ? 'اسأل المعلم الذكي' : 'Ask AI Teacher'}</h1>
                    </div>
                    <div></div>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full p-6 overflow-y-auto">
                <div className="space-y-10">
                    {messages.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-32 h-32 bg-white rounded-full border-8 border-gray-900 mx-auto flex items-center justify-center text-6xl mb-6">🦉</div>
                            <h2 className="text-3xl font-black text-gray-800">
                                {language === 'ar' ? 'مرحباً! أنا هنا للإجابة على أي سؤال مدرسي.' : 'Hi! I am here to answer any school question you have.'}
                            </h2>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'user' ? (
                                <div className="p-6 cartoon-card bg-soft-blue max-w-[70%]">
                                    <p className="text-xl font-bold">{msg.text}</p>
                                </div>
                            ) : (
                                <div className="cartoon-card bg-white p-8 w-full">
                                    {msg.data ? (
                                        <div className="flex flex-col md:flex-row gap-8">
                                            {/* Text Left */}
                                            <div className="flex-1 order-2 md:order-1">
                                                <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                                                    <span className="text-primary text-3xl">💬</span>
                                                    {language === 'ar' ? 'الشرح' : 'Explanation'}
                                                </h3>
                                                <div className="text-xl font-bold leading-relaxed whitespace-pre-wrap text-gray-800">
                                                    {msg.data.text}
                                                </div>
                                            </div>

                                            {/* Images Right */}
                                            <div className="flex-1 order-1 md:order-2 space-y-4">
                                                <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                                                    <span className="text-secondary text-3xl">🎨</span>
                                                    {language === 'ar' ? 'رسومات توضيحية' : 'Illustrations'}
                                                </h3>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {msg.data.images?.map((img, idx) => (
                                                        <div key={idx} className="rounded-3xl border-4 border-gray-900 overflow-hidden shadow-sm">
                                                            <img src={img.url} alt={img.prompt} className="w-full h-auto bg-gray-50" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xl font-bold text-red-500">{msg.text}</p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="p-6 cartoon-card bg-white flex gap-2">
                                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-75"></div>
                                <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="p-6 bg-white border-t-8 border-gray-900">
                <div className="max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        placeholder={language === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="w-full p-6 text-xl rounded-[2rem] border-4 border-gray-900 outline-none pr-32 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        <button className="p-4 bg-soft-pink rounded-2xl border-4 border-gray-900 hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Mic size={24} />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="p-4 bg-primary text-white rounded-2xl border-4 border-gray-900 hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                        >
                            <Send size={24} />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AskAI;
