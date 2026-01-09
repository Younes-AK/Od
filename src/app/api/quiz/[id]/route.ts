import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();
        const quiz = await Quiz.findOne({ lessonId: id });
        return NextResponse.json(quiz);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
