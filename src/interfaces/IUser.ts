import { Types } from 'mongoose';

export interface IUser {
    name: string;
    password: string;
    email: string;
    cellphone: string;
    cpf: string;
    isAdmin: boolean;
    company?: Types.ObjectId;
}