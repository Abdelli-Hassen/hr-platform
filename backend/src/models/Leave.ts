import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
    employeeId: mongoose.Types.ObjectId;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approvalDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const LeaveSchema: Schema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    leaveType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvalDate: { type: Date }
}, { timestamps: true });

export default mongoose.model<ILeave>('Leave', LeaveSchema);
