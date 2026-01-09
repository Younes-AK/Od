import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Exercise from '@/models/Exercise';
import { generateExercises } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const { lessonId, lessonContent, language, age } = await req.json();

        await connectDB();

        const aiData = await generateExercises(lessonContent, { language, age });

        // Save generated exercises
        const exercises = [];
        if (aiData.exercises) {
            for (const item of aiData.exercises) {
                const ex = await Exercise.create({
                    lessonId,
                    language,
                    difficulty: item.difficulty || 'medium',
                    question: item.question,
                    answer: 'AI generated',
                });
                exercises.push(ex);
            }
        }

        return NextResponse.json({
            message: 'Exercises generated successfully',
            exercises,
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
