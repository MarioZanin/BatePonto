import { Appointment } from '../schemas/Appointment';

export default class AppointmentRepository {

    public async findById(id: string) {
        return await Appointment.findOne({ _id: id });
    }

    public async findbyDate(date, userId) {
        const filters = {
            start: {
              $gte: date.start,
              $lt: date.end
            },
            end: null
        }
        return await Appointment.findOne({}).where(filters);
    }

    public async findAll(userId: string) {
        return await Appointment.find({ user: userId });
    }

    public async update(id : string, appointment) {
        return await Appointment.findOneAndUpdate({ _id: id }, appointment);
    }

    public async remove(id: string) {
        return await Appointment.findOneAndRemove({ _id: id });
    }

    public async save(appointment) {
        return await Appointment.create(appointment);
    }
}