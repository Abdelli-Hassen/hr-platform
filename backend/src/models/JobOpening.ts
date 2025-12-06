import mongoose, { Schema, Document } from 'mongoose';

export interface IJobOpening extends Document {
    jobTitle: string;
    departmentId: mongoose.Types.ObjectId;
    positionCount: number;
    description: string;
    requirements?: string;
    salaryMin: number;
    salaryMax: number;
    status: 'open' | 'closed' | 'draft';
    postedDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const JobOpeningSchema: Schema = new Schema({
    jobTitle: { type: String, required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    positionCount: { type: Number, required: true },
    description: { type: String, required: true },
    requirements: { type: String },
    salaryMin: { type: Number, required: true },
    salaryMax: { type: Number, required: true },
    status: { type: String, enum: ['open', 'closed', 'draft'], default: 'open' },
    postedDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IJobOpening>('JobOpening', JobOpeningSchema);
