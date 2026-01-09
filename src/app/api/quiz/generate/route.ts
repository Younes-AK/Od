import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';
import { generateQuiz } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const { lessonId, lessonContent, language, age } = await req.json();

        await connectDB();

        const aiData = await generateQuiz(lessonContent, { language, age });

        const quiz = await Quiz.create({
            lessonId,
            language,
            questions: aiData.questions || [],
        });

        return NextResponse.json({
            message: 'Quiz generated successfully',
            quiz,
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
