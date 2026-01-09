'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Upload, MessageSquare, Book, Trophy, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

import { useSession, signOut } from 'next-auth/react';

const DashboardCard = ({ title, icon, color, href }: { title: string, icon: React.ReactNode, color: string, href: string }) => (
    <Link href={href}>
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`cartoon-card ${color} p-10 flex flex-col items-center justify-center gap-6 text-center cursor-pointer h-full`}
        >
            <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center border-4 border-gray-900">
                {icon}
            </div>
            <h3 className="text-2xl font-black">{title}</h3>
        </motion.div>
    </Link>
);

const StudentDashboard = () => {
    const { language } = useLanguage();
    const { data: session } = useSession();

    const cards = [
        { title: language === 'ar' ? 'ارفع درسـك' : 'Upload Lesson', icon: <Upload size={48} />, color: 'bg-soft-blue', href: '/dashboard/upload' },
        { title: language === 'ar' ? 'اسأل المعلم' : 'Ask AI', icon: <MessageSquare size={48} />, color: 'bg-soft-pink', href: '/dashboard/ask' },
        { title: language === 'ar' ? 'دروسي' : 'My Lessons', icon: <Book size={48} />, color: 'bg-soft-green', href: '/dashboard/lessons' },
        { title: language === 'ar' ? 'إنجازاتي' : 'My Progress', icon: <Trophy size={48} />, color: 'bg-yellow-100', href: '/dashboard/progress' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <header className="px-6 py-8 border-b-8 border-gray-900 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-gray-900 bg-soft-blue flex items-center justify-center text-3xl">🦉</div>
                    <div>
                        <h1 className="text-3xl font-black">{language === 'ar' ? `أهلاً بك يا ${session?.user?.name || 'بطل'}!` : `Welcome, ${session?.user?.name || 'Hero'}!`}</h1>
                        <p className="font-bold text-gray-600">{language === 'ar' ? 'ماذا تريد أن تتعلم اليوم؟' : 'What do you want to learn today?'}</p>
                    </div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="cartoon-button bg-red-100 text-red-600 hover:bg-red-200"
                >
                    <LogOut />
                </button>
            </header>

            <main className="max-w-7xl mx-auto p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cards.map((card, i) => (
                        <DashboardCard key={i} {...card} />
                    ))}
                </div>

                <section className="mt-20">
                    <div className="cartoon-card bg-gray-50 p-8 border-dashed border-gray-400">
                        <h2 className="text-2xl font-black mb-4">{language === 'ar' ? 'آخر الأنشطة' : 'Recent Activities'}</h2>
                        <div className="text-gray-500 font-bold italic">
                            {language === 'ar' ? 'لا توجد أنشطة بعد. ابدأ برفع أول درس لك!' : 'No activities yet. Start by uploading your first lesson!'}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StudentDashboard;
