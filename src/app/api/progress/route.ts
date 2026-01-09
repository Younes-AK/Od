import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Progress from '@/models/Progress';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        await connectDB();

        const progress = await Progress.find({ userId }).populate('lessonId');

        return NextResponse.json(progress);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId, lessonId, completed, quizScore } = await req.json();

        await connectDB();

        const progress = await Progress.findOneAndUpdate(
            { userId, lessonId },
            { completed, quizScore, lastAccessed: new Date() },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            message: 'Progress updated successfully',
            progress,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
