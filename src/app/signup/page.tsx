'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight, ArrowLeft, GraduationCap, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SignUp = () => {
    const { language, setLanguage, t, dir } = useLanguage();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        age: 10,
        language: language
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            // Auto login after signup
            await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                callbackUrl: '/dashboard',
            });
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="cartoon-card bg-white p-8 w-full max-w-lg"
            >
                <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold mb-8">
                    {dir === 'ltr' ? <ArrowLeft /> : <ArrowRight />}
                    {t('common.appName')}
                </Link>
                <h1 className="text-3xl font-black mb-6">{t('common.signUp')}</h1>

                {error && (
                    <div className="bg-red-100 border-2 border-red-600 text-red-600 p-3 rounded-xl mb-6 font-bold">
                        {error}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-bold">Pick your role:</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => { setFormData({ ...formData, role: 'student' }); nextStep(); }}
                                    className={`p-6 cartoon-card text-center flex flex-col items-center gap-4 ${formData.role === 'student' ? 'bg-soft-blue border-primary' : 'bg-white'}`}
                                >
                                    <GraduationCap className="w-12 h-12" />
                                    <span className="font-bold">Student</span>
                                </button>
                                <button
                                    onClick={() => { setFormData({ ...formData, role: 'parent' }); nextStep(); }}
                                    className={`p-6 cartoon-card text-center flex flex-col items-center gap-4 ${formData.role === 'parent' ? 'bg-soft-pink border-secondary' : 'bg-white'}`}
                                >
                                    <Users className="w-12 h-12" />
                                    <span className="font-bold">Parent</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-bold">Details:</h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-4 rounded-xl border-4 border-gray-900 outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-4 rounded-xl border-4 border-gray-900 outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full p-4 rounded-xl border-4 border-gray-900 outline-none"
                                />
                                {formData.role === 'student' && (
                                    <div>
                                        <label className="block font-bold mb-2">Age: {formData.age}</label>
                                        <input
                                            type="range" min="5" max="13"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                                            className="w-full h-4 bg-soft-blue rounded-lg appearance-none cursor-pointer border-4 border-gray-900"
                                        />
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => { setLanguage('en'); setFormData({ ...formData, language: 'en' }) }}
                                        className={`flex-1 p-3 cartoon-card ${formData.language === 'en' ? 'bg-primary text-white' : 'bg-white'}`}
                                    >English</button>
                                    <button
                                        onClick={() => { setLanguage('ar'); setFormData({ ...formData, language: 'ar' }) }}
                                        className={`flex-1 p-3 cartoon-card ${formData.language === 'ar' ? 'bg-primary text-white' : 'bg-white'}`}
                                    >العربية</button>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={prevStep} className="cartoon-button flex-1 bg-gray-200">Back</button>
                                <button onClick={handleSubmit} className="cartoon-button flex-[2] bg-primary text-white">Create Account</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center mt-6 font-bold text-gray-600">
                    Already have an account? <Link href="/signin" className="text-primary underline">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignUp;
