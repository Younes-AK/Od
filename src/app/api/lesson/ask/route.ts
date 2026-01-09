import { NextResponse } from 'next/server';
import { explainLesson } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const { question, language, age } = await req.json();

        if (!question) {
            return NextResponse.json({ error: 'Question is required' }, { status: 400 });
        }

        const data = await explainLesson(question, {
            language: language || 'en',
            age: age || 10
        });

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
