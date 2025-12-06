import mongoose, { Schema, Document } from 'mongoose';

console.log('Loading Payroll Model...');

export interface IPayroll extends Document {
    employeeId: mongoose.Types.ObjectId;
    month: number;
    year: number;
    baseSalary: number;
    allowances: number;
    deductions: number;
    taxes: number;
    netSalary: number;
    status: 'pending' | 'validated' | 'paid';
    paymentDate?: Date;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}

const PayrollSchema: Schema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    baseSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'validated', 'paid'], default: 'pending' },
    paymentDate: { type: Date },
    currency: { type: String, default: 'TND' }
}, { timestamps: true });

export default mongoose.model<IPayroll>('Payroll', PayrollSchema);
