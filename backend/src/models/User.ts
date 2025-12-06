import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string;
    visiblePassword?: string;
    role: 'admin' | 'hr' | 'employee' | 'manager';
    employeeId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    visiblePassword: { type: String },
    role: { type: String, enum: ['admin', 'hr', 'employee', 'manager'], default: 'employee' },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
