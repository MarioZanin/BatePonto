import { Request, Response } from 'express';

import AppointmentRepository from '../repositories/AppointmentRepository';
import AppointmentService from '../services/AppointmentService';

class AppointmentController {
    appointmentRepository: AppointmentRepository;
    service: AppointmentService;

    constructor() {
        this.appointmentRepository = new AppointmentRepository();
        this.service = new AppointmentService(this.appointmentRepository);
    }

    public async find(req: Request, res: Response): Promise<Response> {
        try {
            const appointment = await this.service.find(req.params.id);

            return res.status(200).json(appointment);
        } catch {
            return res.status(500).json({ msg: 'Something went wrong' });
        }
    }

    public async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const appointments = await this.service.findAll(req.userId);

            return res.status(200).json(appointments);
        } catch {
            return res.status(500).json({ msg: 'Something went wrong' });
        }
    }

    public async findByDate(req: Request, res: Response): Promise<Response> {
        try {
            const { start, end } = req.query;

            const dateStart = new Date(start as string);
            const dateEnd = new Date(end as string);

            const appointments = await this.service.findByDate(req.userId, dateStart, dateEnd);

            return res.status(200).json(appointments);
        } catch {
            return res.status(500).json({ msg: 'Something went wrong' });
        }
    }

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const reqDate = req.body.start;

            const appointment = { start: reqDate, user: req.userId };
            await this.service.create(appointment);

            return res.status(201).json({ msg: 'Appointment created successfully' });
        } catch {
            return res.status(500).json({ msg: 'Something went wrong' });
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const { start, end } = req.body;

            const appointment = { start, end };

            await this.service.update(req.params.id, appointment);

            return res.status(201).json({ msg: 'Appointment updated successfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

    public async remove(req: Request, res: Response): Promise<Response> {
        try {
            await this.service.remove(req.params.id);

            return res.status(201).json({ msg: 'Appointment removed successfully' });
        } catch {
            return res.status(500).json({ msg: 'Something went wrong' });
        }
    }
}

export default new AppointmentController();