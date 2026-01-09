'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Upload, FileText, Camera, ArrowLeft, Send, Type } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const UploadLesson = () => {
    const { language, t } = useLanguage();
    const { data: session } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [uploading, setUploading] = useState(false);
    const [mode, setMode] = useState<'upload' | 'type'>('type');

    const handleGenerate = async () => {
        if (!title.trim() || !content.trim()) return;
        setUploading(true);

        try {
            const res = await fetch('/api/lesson/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    sourceType: mode === 'type' ? 'text' : 'pdf',
                    language: language
                }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push(`/dashboard/lessons/${data._id}`);
            } else {
                throw new Error(data.error || 'Failed to generate lesson');
            }
        } catch (error: any) {
            console.error('Generation Error:', error);
            const errorMsg = error.message || 'Failed to generate lesson';
            alert(language === 'ar'
                ? `فشل إنشاء الدرس: ${errorMsg}. حاول مرة أخرى.`
                : `Failed to generate lesson: ${errorMsg}. Try again.`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-soft-blue/10 p-6 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 font-black text-gray-600 mb-8 hover:text-primary transition-colors">
                    <ArrowLeft />
                    {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
                </Link>

                <h1 className="text-4xl font-black mb-8">{language === 'ar' ? 'ابدأ درساً ممتعاً جديداً' : 'Start a New Fun Lesson'}</h1>

                <div className="space-y-8">
                    {/* Title Input */}
                    <div className="cartoon-card bg-white p-8">
                        <label className="block text-2xl font-black mb-4">{language === 'ar' ? 'ما هو عنوان الدرس؟' : 'What is the lesson title?'}</label>
                        <input
                            type="text"
                            placeholder={language === 'ar' ? 'مثلاً: الكواكب، الكسور، تاريخ العرب...' : 'e.g., Solar System, Fractions, Colors...'}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-4 text-xl rounded-2xl border-4 border-gray-900 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        />
                    </div>

                    {/* Mode Selection */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setMode('type')}
                            className={`flex-1 p-6 cartoon-button flex flex-col items-center gap-2 ${mode === 'type' ? 'bg-primary text-white' : 'bg-white'}`}
                        >
                            <Type size={32} />
                            <span className="font-bold">{language === 'ar' ? 'اكتب الموضوع' : 'Type Topic'}</span>
                        </button>
                        <button
                            onClick={() => setMode('upload')}
                            className={`flex-1 p-6 cartoon-button flex flex-col items-center gap-2 ${mode === 'upload' ? 'bg-secondary text-white' : 'bg-white'}`}
                        >
                            <Upload size={32} />
                            <span className="font-bold">{language === 'ar' ? 'ارفع ملف' : 'Upload File'}</span>
                        </button>
                    </div>

                    {/* Content Input */}
                    {mode === 'type' ? (
                        <div className="cartoon-card bg-white p-8">
                            <label className="block text-2xl font-black mb-4">{language === 'ar' ? 'عن ماذا تريد أن تتعلم؟' : 'What do you want to learn about?'}</label>
                            <textarea
                                rows={4}
                                placeholder={language === 'ar' ? 'اكتب بالتفصيل ما تريد فهمه...' : 'Type exactly what you want to understand...'}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-4 text-xl rounded-2xl border-4 border-gray-900 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>
                    ) : (
                        <div className="cartoon-card bg-white p-10 flex flex-col items-center justify-center border-dashed border-gray-400">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept=".pdf,.txt"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setUploading(true);
                                    try {
                                        if (file.type === 'application/pdf') {
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            const res = await fetch('/api/lesson/parse-pdf', {
                                                method: 'POST',
                                                body: formData
                                            });
                                            const data = await res.json();
                                            if (data.text) {
                                                setContent(data.text);
                                                if (!title) setTitle(file.name.replace('.pdf', ''));
                                            }
                                        } else {
                                            const text = await file.text();
                                            setContent(text);
                                            if (!title) setTitle(file.name.replace('.txt', ''));
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert('Failed to read file');
                                    } finally {
                                        setUploading(false);
                                    }
                                }}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                <FileText size={64} className="text-primary mb-6 animate-pulse" />
                                <p className="text-xl font-bold mb-2">
                                    {language === 'ar' ? 'انقر لرفع ملف (PDF أو نص)' : 'Click to upload (PDF or Text)'}
                                </p>
                                {content && (
                                    <p className="text-sm font-bold text-soft-green">
                                        {language === 'ar' ? '✅ تم استخراج النص بنجاح' : '✅ Text extracted successfully'}
                                    </p>
                                )}
                            </label>
                        </div>
                    )}
                </div>

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={handleGenerate}
                        disabled={!title || !content || uploading}
                        className={`cartoon-button text-2xl px-12 py-6 flex items-center gap-4 ${!title || !content || uploading ? 'bg-gray-300 opacity-50 cursor-not-allowed' : 'bg-primary text-white'}`}
                    >
                        {uploading ? (
                            <span className="animate-pulse">{language === 'ar' ? 'جاري التحضير...' : 'Processing...'}</span>
                        ) : (
                            <>
                                <Send />
                                <span>{language === 'ar' ? 'ابدأ التعلم الآن!' : 'Start Learning Now!'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadLesson;
