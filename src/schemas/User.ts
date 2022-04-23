import { Schema, Model, model } from 'mongoose';
import { IUser } from '../interfaces/IUser';

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    cellphone:  { type: String, required: true },
    cpf: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true }
}, {
    timestamps: true
});

export const User: Model<IUser> = model<IUser>('User', UserSchema);