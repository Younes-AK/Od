'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Target, CheckCircle2 } from 'lucide-react';

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left rtl:lg:text-right">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-black leading-tight mb-6"
          >
            {t('landing.heroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl lg:text-2xl text-gray-600 mb-10"
          >
            {t('landing.heroSubtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start rtl:lg:justify-start"
          >
            <Link href="/signup" className="cartoon-button bg-primary text-white text-xl px-10 py-5">
              {t('common.startLearning')}
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 relative"
        >
          <div className="w-full h-[400px] lg:h-[500px] bg-soft-blue rounded-[3rem] border-8 border-gray-900 overflow-hidden flex items-center justify-center p-8">
            <Image
              src="/mascot.png"
              alt="Mascot"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const { t } = useLanguage();
  const steps = [
    { key: 'step1Title', icon: "📘", color: 'bg-soft-blue' },
    { key: 'step2Title', icon: "🧠", color: 'bg-soft-pink' },
    { key: 'step3Title', icon: "🎯", color: 'bg-soft-green' },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16">{t('landing.howItWorks')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className={`w-24 h-24 ${step.color} rounded-full border-4 border-gray-900 flex items-center justify-center text-5xl mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                {step.icon}
              </div>
              <h3 className="text-2xl font-black">{t(`landing.${step.key}`)}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const { t } = useLanguage();
  const features = [
    { icon: <BookOpen className="w-10 h-10" />, key: 'feature1', color: 'bg-soft-blue' },
    { icon: <Brain className="w-10 h-10" />, key: 'feature2', color: 'bg-soft-pink' },
    { icon: <Target className="w-10 h-10" />, key: 'feature3', color: 'bg-soft-green' },
    { icon: <CheckCircle2 className="w-10 h-10" />, key: 'feature4', color: 'bg-yellow-100' },
  ];

  return (
    <section className="py-20 bg-gray-50 border-y-8 border-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black text-center mb-16">{t('landing.features')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className={`cartoon-card p-8 ${f.color} flex flex-col items-center text-center`}>
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold">{t(`landing.${f.key}`)}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16">{t('landing.pricing')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="cartoon-card p-10 bg-white">
            <h3 className="text-3xl font-black mb-4">{t('landing.free')}</h3>
            <p className="text-5xl font-black mb-8">$0<span className="text-xl">/mo</span></p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-accent" /> 2 Lessons / week</li>
              <li className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-accent" /> Basic Quizzes</li>
            </ul>
            <button className="cartoon-button w-full border-primary text-primary">Get Started</button>
          </div>
          <div className="cartoon-card p-10 bg-primary text-white border-primary">
            <h3 className="text-3xl font-black mb-4">{t('landing.pro')}</h3>
            <p className="text-5xl font-black mb-8">$19<span className="text-xl">/mo</span></p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-white" /> Unlimited Lessons</li>
              <li className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-white" /> Full AI Explanations</li>
              <li className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-white" /> Visual Learning (AI Images)</li>
            </ul>
            <button className="cartoon-button w-full bg-white text-primary">Go Pro</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
    </main>
  );
}
