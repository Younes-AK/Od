'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogIn, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const SignIn = () => {
    const { language, t, dir } = useLanguage();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(language === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="cartoon-card bg-white p-8 w-full max-w-md"
            >
                <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold mb-8">
                    {dir === 'ltr' ? <ArrowLeft /> : <ArrowRight />}
                    {t('common.appName')}
                </Link>
                <h1 className="text-3xl font-black mb-6">{t('common.signIn')}</h1>
                {error && (
                    <div className="bg-red-100 border-2 border-red-600 text-red-600 p-3 rounded-xl mb-6 font-bold">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded-xl border-4 border-gray-900 focus:ring-4 ring-primary/20 outline-none"
                            placeholder="hello@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded-xl border-4 border-gray-900 focus:ring-4 ring-primary/20 outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="cartoon-button w-full bg-primary text-white text-xl py-4 flex items-center justify-center gap-2">
                        <LogIn />
                        {t('common.signIn')}
                    </button>
                </form>
                <p className="text-center mt-6 font-bold text-gray-600">
                    Don't have an account? <Link href="/signup" className="text-primary underline">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignIn;
