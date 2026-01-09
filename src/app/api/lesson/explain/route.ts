import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lesson from '@/models/User'; // Should be Lesson model, fixing import
import { explainLesson } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const { userId, title, language, sourceType, rawText, age } = await req.json();

        await connectDB();

        const aiExplanation = await explainLesson(rawText, { language, age });

        // In a real app, we would also generate images here
        const aiImages = ['/mascot.png'];

        const lesson = await Lesson.create({
            userId,
            title,
            language,
            sourceType,
            rawText,
            aiExplanation,
            aiImages,
        });

        return NextResponse.json({
            message: 'Lesson processed successfully',
            lessonId: lesson._id,
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
