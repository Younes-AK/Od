import mongoose, { Schema } from 'mongoose';

const QuizSchema = new Schema({
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    language: { type: String, enum: ['ar', 'en'], required: true },
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String }],
        correctAnswer: { type: String, required: true }
    }],
    score: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
