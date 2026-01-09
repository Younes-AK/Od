'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Book, ArrowLeft, Plus, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LessonsPage() {
    const { language, t } = useLanguage();
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await fetch('/api/lesson');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setLessons(data);
                }
            } catch (error) {
                console.error('Failed to fetch lessons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="px-6 py-6 border-b-8 border-gray-900 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="cartoon-button h-12 w-12 flex items-center justify-center bg-gray-100 p-0">
                        <ArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black">{language === 'ar' ? 'دروسي' : 'My Lessons'}</h1>
                    </div>
                </div>
                <Link href="/dashboard/upload" className="cartoon-button bg-soft-blue flex items-center gap-2">
                    <Plus size={20} />
                    <span>{language === 'ar' ? 'درس جديد' : 'New Lesson'}</span>
                </Link>
            </header>

            <main className="max-w-7xl mx-auto p-8 lg:p-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-16 h-16 border-8 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                        <p className="text-xl font-bold text-gray-500">
                            {language === 'ar' ? 'جاري التحميل...' : 'Loading your lessons...'}
                        </p>
                    </div>
                ) : lessons.length === 0 ? (
                    <div className="text-center py-20 px-8 cartoon-card bg-gray-50 border-dashed border-gray-400">
                        <div className="text-6xl mb-6">📚</div>
                        <h2 className="text-2xl font-black mb-4">
                            {language === 'ar' ? 'لا يوجد دروس حالياً' : 'No lessons found'}
                        </h2>
                        <p className="text-gray-600 font-bold mb-8 italic">
                            {language === 'ar' ? 'ابدأ برفع أول درس لك الآن!' : 'Start by uploading your very first lesson!'}
                        </p>
                        <Link href="/dashboard/upload" className="cartoon-button bg-soft-green inline-flex items-center gap-2">
                            <Plus size={24} />
                            <span>{language === 'ar' ? 'ارفع درسـك' : 'Upload Your First Lesson'}</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {lessons.map((lesson, i) => (
                            <Link key={lesson._id} href={`/dashboard/lessons/${lesson._id}`}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="cartoon-card bg-white p-6 flex flex-col h-full border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-soft-blue rounded-xl border-2 border-gray-900">
                                            <Book size={24} />
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-bold bg-gray-100 px-2 py-1 rounded border-2 border-gray-900">
                                            <Clock size={14} />
                                            {formatDate(lesson.createdAt)}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black mb-3 line-clamp-2 min-h-[3.5rem]">
                                        {lesson.title}
                                    </h3>

                                    <p className="text-gray-600 font-semibold text-sm mb-6 line-clamp-3 italic">
                                        {lesson.rawText}
                                    </p>

                                    <div className="mt-auto pt-4 flex items-center justify-between border-t-2 border-gray-100">
                                        <span className="text-sm font-black text-soft-blue uppercase tracking-wider">
                                            {lesson.sourceType}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-900 font-black text-sm">
                                            {language === 'ar' ? 'عرض' : 'View'}
                                            <ExternalLink size={16} />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
