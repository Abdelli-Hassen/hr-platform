import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
    jobTitle: string;
    minSalary?: number;
    maxSalary?: number;
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema: Schema = new Schema({
    jobTitle: { type: String, required: true, unique: true },
    minSalary: { type: Number },
    maxSalary: { type: Number }
}, { timestamps: true });

export default mongoose.model<IJob>('Job', JobSchema);
