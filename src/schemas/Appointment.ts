import { Schema, Model, model } from 'mongoose';
import { IAppointment } from '../interfaces/IAppointment';

const AppointmentSchema = new Schema<IAppointment>({
    start: { type: Date, required: true },
    end: { type: Date },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});
  
export const Appointment: Model<IAppointment> = model<IAppointment>('Appointment', AppointmentSchema);