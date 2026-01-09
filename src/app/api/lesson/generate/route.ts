import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Lesson from '@/models/Lesson';
import { explainLesson } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { content, title, sourceType, language } = await req.json();

        if (!content || !title) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        await connectDB();

        // Generate AI explanation with images
        const aiData = await explainLesson(content, {
            language: language || (session.user as any).language || 'en',
            age: (session.user as any).age || 10
        });

        const lesson = await Lesson.create({
            userId: (session.user as any).id,
            title: title,
            language: language || (session.user as any).language || 'en',
            sourceType: sourceType || 'text',
            rawText: content,
            aiExplanation: aiData.text,
            aiImages: aiData.images.map((img: any) => img.url),
        });

        return NextResponse.json(lesson);
    } catch (error: any) {
        console.error('Lesson Generation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
