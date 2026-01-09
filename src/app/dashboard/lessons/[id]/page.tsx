'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, BookOpen, Brain, Star, CheckCircle, Award, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

const LessonPage = () => {
    const { language } = useLanguage();
    const { id } = useParams();
    const [lesson, setLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [section, setSection] = useState<'explanation' | 'exercises' | 'quiz'>('explanation');
    const [exercises, setExercises] = useState<any[]>([]);
    const [quiz, setQuiz] = useState<any>(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchLessonData = async () => {
            try {
                const [lessonRes, exRes, quizRes] = await Promise.all([
                    fetch(`/api/lesson/${id}`),
                    fetch(`/api/exercise/${id}`),
                    fetch(`/api/quiz/${id}`)
                ]);

                const lessonData = await lessonRes.json();
                const exData = await exRes.json();
                const quizData = await quizRes.json();

                if (lessonRes.ok) setLesson(lessonData);
                if (exRes.ok) setExercises(exData);
                if (quizRes.ok) setQuiz(quizData);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLessonData();
    }, [id]);

    const handleGenerateExercises = async () => {
        setGenerating(true);
        try {
            const res = await fetch('/api/exercise/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lessonId: id,
                    lessonContent: lesson.aiExplanation,
                    language: lesson.language,
                    age: 10 // Default age
                })
            });
            const data = await res.json();
            if (res.ok) setExercises(data.exercises);
        } catch (error) {
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    const handleGenerateQuiz = async () => {
        setGenerating(true);
        try {
            const res = await fetch('/api/quiz/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lessonId: id,
                    lessonContent: lesson.aiExplanation,
                    language: lesson.language,
                    age: 10
                })
            });
            const data = await res.json();
            if (res.ok) setQuiz(data.quiz);
        } catch (error) {
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-soft-blue/10">
            <div className="text-center">
                <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                <p className="text-2xl font-black">{language === 'ar' ? 'جاري تحميل درسك الممتع...' : 'Loading your fun lesson...'}</p>
            </div>
        </div>
    );

    if (!lesson) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-black mb-4">404</h1>
                <p className="text-xl font-bold mb-8">{language === 'ar' ? 'عذراً، لم نجد هذا الدرس.' : 'Oops, we couldn\'t find this lesson.'}</p>
                <Link href="/dashboard" className="cartoon-button bg-primary text-white">
                    {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white pb-20">
            <header className="p-6 border-b-8 border-gray-900 bg-white sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/dashboard/lessons" className="cartoon-button bg-gray-100 flex items-center gap-2">
                        <ArrowLeft />
                        {language === 'ar' ? 'دروسي' : 'My Lessons'}
                    </Link>
                    <h1 className="text-3xl font-black">{lesson.title}</h1>
                    <div className="w-12 h-12 rounded-full bg-yellow-100 border-4 border-gray-900 flex items-center justify-center font-black">
                        {lesson.progress || 0}%
                    </div>
                </div>
            </header>

            <nav className="max-w-6xl mx-auto flex gap-4 p-6 overflow-x-auto">
                <button
                    onClick={() => setSection('explanation')}
                    className={`px-8 py-4 cartoon-button whitespace-nowrap ${section === 'explanation' ? 'bg-primary text-white' : 'bg-white'}`}
                >
                    {language === 'ar' ? 'الشرح' : 'Explanation'}
                </button>
                <button
                    onClick={() => setSection('exercises')}
                    className={`px-8 py-4 cartoon-button whitespace-nowrap ${section === 'exercises' ? 'bg-soft-green text-gray-900' : 'bg-white'}`}
                >
                    {language === 'ar' ? 'تمارين' : 'Exercises'}
                </button>
                <button
                    onClick={() => setSection('quiz')}
                    className={`px-8 py-4 cartoon-button whitespace-nowrap ${section === 'quiz' ? 'bg-soft-pink text-gray-900' : 'bg-white'}`}
                >
                    {language === 'ar' ? 'اختبار' : 'Quiz'}
                </button>
            </nav>

            <main className="max-w-6xl mx-auto px-6">
                <motion.div
                    key={section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {section === 'explanation' && (
                        <div className="flex flex-col lg:flex-row gap-10">
                            {/* Text Left */}
                            <div className="flex-[3] space-y-6">
                                <div className="cartoon-card bg-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <h2 className="text-3xl font-black mb-6 text-primary">
                                        {language === 'ar' ? 'دعونا نتعلم!' : 'Let\'s Learn!'}
                                    </h2>
                                    <div className="text-2xl font-bold leading-relaxed whitespace-pre-wrap text-gray-800">
                                        {lesson.aiExplanation}
                                    </div>
                                </div>
                            </div>

                            {/* Images Right */}
                            <div className="flex-[2] space-y-6">
                                <h2 className="text-3xl font-black text-secondary">
                                    {language === 'ar' ? 'صور تعليمية' : 'Learning Images'}
                                </h2>
                                <div className="space-y-6">
                                    {lesson.aiImages?.map((img: string, idx: number) => (
                                        <div key={idx} className="cartoon-card bg-white p-2 overflow-hidden border-8">
                                            <img src={img} alt="Lesson Illustration" className="w-full h-auto rounded-3xl" />
                                        </div>
                                    ))}
                                    {(!lesson.aiImages || lesson.aiImages.length === 0) && (
                                        <div className="cartoon-card bg-gray-50 aspect-square flex items-center justify-center border-dashed text-gray-400">
                                            <Star size={48} className="animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {section === 'exercises' && (
                        <div className="space-y-8">
                            {exercises.length === 0 ? (
                                <div className="text-center py-20 bg-soft-green/20 rounded-[3rem] border-8 border-dashed border-gray-400">
                                    <Brain size={80} className="mx-auto text-primary mb-6" />
                                    <h2 className="text-4xl font-black mb-4">{language === 'ar' ? 'وقت التدريب!' : 'Practice Time!'}</h2>
                                    <p className="text-xl font-bold text-gray-500 mb-8">{language === 'ar' ? 'اضغط لتوليد تمارين ذكية مخصصة لك.' : 'Click to generate smart exercises tailored for you.'}</p>
                                    <button
                                        onClick={handleGenerateExercises}
                                        disabled={generating}
                                        className="cartoon-button bg-primary text-white text-2xl px-12 py-6"
                                    >
                                        {generating ? <Loader2 className="animate-spin inline mr-2" /> : null}
                                        {language === 'ar' ? 'توليد تمارين' : 'Generate Exercises'}
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {exercises.map((ex, idx) => (
                                        <div key={idx} className="cartoon-card bg-white p-8 flex items-start gap-6 border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(147,197,253,1)]">
                                            <div className="w-12 h-12 rounded-full bg-soft-blue border-4 border-gray-900 flex items-center justify-center font-black text-xl shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-800">{ex.question}</p>
                                                <span className="inline-block mt-4 px-4 py-1 bg-yellow-100 rounded-full border-2 border-gray-900 text-sm font-black uppercase">
                                                    {ex.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {section === 'quiz' && (
                        <div className="space-y-8">
                            {!quiz ? (
                                <div className="text-center py-20 bg-soft-pink/20 rounded-[3rem] border-8 border-dashed border-gray-400">
                                    <Award size={80} className="mx-auto text-secondary mb-6" />
                                    <h2 className="text-4xl font-black mb-4">{language === 'ar' ? 'جاهز للاختبار؟' : 'Ready for Quiz?'}</h2>
                                    <p className="text-xl font-bold text-gray-500 mb-8">{language === 'ar' ? 'اضغط لاختبار معلوماتك والحصول على النجوم!' : 'Click to test your knowledge and earn stars!'}</p>
                                    <button
                                        onClick={handleGenerateQuiz}
                                        disabled={generating}
                                        className="cartoon-button bg-secondary text-white text-2xl px-12 py-6"
                                    >
                                        {generating ? <Loader2 className="animate-spin inline mr-2" /> : null}
                                        {language === 'ar' ? 'توليد اختبار' : 'Generate Quiz'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {quiz.questions.map((q: any, idx: number) => (
                                        <div key={idx} className="cartoon-card bg-white p-8 border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(249,168,212,1)]">
                                            <h3 className="text-2xl font-black mb-6">{idx + 1}. {q.question}</h3>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                {q.options.map((opt: string, optIdx: number) => (
                                                    <button
                                                        key={optIdx}
                                                        className="p-4 rounded-2xl border-4 border-gray-900 font-bold hover:bg-soft-blue transition-colors text-left"
                                                        onClick={() => {
                                                            if (opt === q.correctAnswer) alert(language === 'ar' ? 'أحسنت! إجابة صحيحة ⭐' : 'Great job! Correct answer ⭐');
                                                            else alert(language === 'ar' ? 'حاول مرة أخرى ❤️' : 'Try again ❤️');
                                                        }}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default LessonPage;
