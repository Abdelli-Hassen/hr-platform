import mongoose, { Schema, Document } from 'mongoose';

export interface IAbsence extends Document {
    employeeId: mongoose.Types.ObjectId;
    absenceDate: Date;
    absenceType: string;
    reason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AbsenceSchema: Schema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    absenceDate: { type: Date, required: true },
    absenceType: { type: String, required: true },
    reason: { type: String }
}, { timestamps: true });

export default mongoose.model<IAbsence>('Absence', AbsenceSchema);
