import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    jobId?: mongoose.Types.ObjectId;
    jobTitle?: string;
    departmentId?: mongoose.Types.ObjectId;
    salary?: number;
    hireDate?: Date;
    status: 'active' | 'inactive' | 'terminated' | 'on_leave';
    managerId?: mongoose.Types.ObjectId;
    cin?: string;
    birthDate?: Date;
    nationality?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    contractType?: string;
    contractStart?: Date;
    contractEnd?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    jobTitle: { type: String },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
    salary: { type: Number },
    hireDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive', 'terminated', 'on_leave'], default: 'active' },
    managerId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    cin: { type: String },
    birthDate: { type: Date },
    nationality: { type: String },
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    contractType: { type: String },
    contractStart: { type: Date },
    contractEnd: { type: Date }
}, { timestamps: true });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
