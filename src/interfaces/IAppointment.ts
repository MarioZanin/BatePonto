import { Types } from 'mongoose';

export interface IAppointment {
    start: Date;
    end?: Date;
    user: Types.ObjectId;
}