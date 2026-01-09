import mongoose, { Schema } from 'mongoose';

const ExerciseSchema = new Schema({
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    language: { type: String, enum: ['ar', 'en'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
