import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
    jobOpeningId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    cvPath?: string;
    coverLetter?: string;
    status: 'submitted' | 'interviewing' | 'hired' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const CandidateSchema: Schema = new Schema({
    jobOpeningId: { type: Schema.Types.ObjectId, ref: 'JobOpening', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    cvPath: { type: String },
    coverLetter: { type: String },
    status: { type: String, enum: ['submitted', 'interviewing', 'hired', 'rejected'], default: 'submitted' }
}, { timestamps: true });

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);
