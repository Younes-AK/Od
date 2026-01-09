import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Lesson from '@/models/Lesson';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const lessons = await Lesson.find({
            userId: (session.user as any).id
        }).sort({ createdAt: -1 });

        return NextResponse.json(lessons);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
