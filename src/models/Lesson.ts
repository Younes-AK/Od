import mongoose, { Schema } from 'mongoose';

const LessonSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    language: { type: String, enum: ['ar', 'en'], required: true },
    sourceType: { type: String, enum: ['pdf', 'image', 'text'], required: true },
    rawText: { type: String },
    aiExplanation: { type: String },
    aiImages: [{ type: String }], // URLs to images
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
