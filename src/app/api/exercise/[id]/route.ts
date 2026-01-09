import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Exercise from '@/models/Exercise';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();
        const exercises = await Exercise.find({ lessonId: id });
        return NextResponse.json(exercises);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
