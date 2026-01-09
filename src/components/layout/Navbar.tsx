'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, LogIn } from 'lucide-react';

import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
    const { language, setLanguage, t } = useLanguage();
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-4 border-gray-900 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold flex items-center gap-2">
                    <span className="bg-primary text-white p-2 rounded-xl">🦉</span>
                    <span className="hidden sm:inline">{t('common.appName')}</span>
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-900 hover:bg-gray-100 transition-colors font-bold"
                    >
                        <Globe className="w-5 h-5" />
                        {language === 'en' ? 'العربية' : 'English'}
                    </button>

                    {session ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="font-bold text-primary">
                                {session.user?.name}
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="cartoon-button bg-gray-100 text-gray-600"
                            >
                                {t('common.logout')}
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/signin"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 font-bold text-primary"
                            >
                                <LogIn className="w-5 h-5" />
                                {t('common.signIn')}
                            </Link>

                            <Link
                                href="/signup"
                                className="cartoon-button bg-primary text-white hover:bg-indigo-700"
                            >
                                {t('common.signUp')}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
