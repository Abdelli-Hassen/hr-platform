import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
    departmentName: string;
    managerId?: mongoose.Types.ObjectId;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}

const DepartmentSchema: Schema = new Schema({
    departmentName: { type: String, required: true, unique: true },
    managerId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    location: { type: String }
}, { timestamps: true });

export default mongoose.model<IDepartment>('Department', DepartmentSchema);
