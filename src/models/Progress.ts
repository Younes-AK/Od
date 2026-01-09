import mongoose, { Schema } from 'mongoose';

const ProgressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    completed: { type: Boolean, default: false },
    quizScore: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now }
});

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
