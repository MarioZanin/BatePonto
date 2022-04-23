import AppointmentRepository from '../repositories/AppointmentRepository';
import UserService from './UserService';
import UserRepository from '../repositories/UserRepository';
import moment from 'moment';
import nodemailer from 'nodemailer';
import { ICompany } from '../interfaces/ICompany';

export default class AppointmentService {
  private appointmentRepository: AppointmentRepository;

  constructor(appointmentRepository: AppointmentRepository) {
    this.appointmentRepository = appointmentRepository;
  }

  public async find(id: string) {
    return await this.appointmentRepository.findById(id);
  }

  public async findByDate(userId: string, dateStart: Date, dateEnd: Date) {
    const userAppointments = await this.findAll(userId);

    const filterAppointments = userAppointments.filter((appointments) => {
      const dateAppointments = moment.utc(appointments.start).format('YYYY-MM-DD');
      const newDateStart = moment(dateStart).format('YYYY-MM-DD');
      const newDateEnd = moment(dateEnd).format('YYYY-MM-DD');

      if (moment(dateAppointments).isSameOrAfter(newDateStart) && moment(dateAppointments).isSameOrBefore(newDateEnd)) {
        return appointments;
      }
    });

    return filterAppointments;
  }

  public async findAll(userId: string) {
    return await this.appointmentRepository.findAll(userId);
  }

  public async triggerEmail(appointment) {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);

    const user = await userService.find(appointment.user);

    const company = user?.company as unknown as ICompany;

    if (user?.email) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const dateTime = moment(appointment.start).format('DD/MM/YYYY - HH:mm');

      await transporter.sendMail({
        from: `Bate Ponto <${process.env.MAIL_USER}>`,
        subject: 'Bate&Ponto - Comprovante de Ponto',
        to: [user.email],
        html: `
            <html>
              <body>
                  <h1>Bate&Ponto</h1>
                  <p>Olá, <b>${user.name}</b>.</p>
                  <p>Este é o seu comprovande de registro de ponto.</p>
                  <p><b>Empregador: <b>${company?.name}</p>
                  <p><b>CNPJ:<b> ${company?.cnpj}</p>
                  <p><b>Colaborador: <b>${user.name}</p>
                  <p><b>CPF: <b>${user.cpf}</p>
                  <p><b>Data e hora de registro: </b> ${dateTime}</p>
              <body/>
            </html>
          `
      });
    }
  }

  public async create(appointment) {
    const day = {
      start: new Date(appointment.start),
      end: new Date(appointment.start)
    }

    await this.triggerEmail(appointment);

    this.setDateParameter(day);

    const dateReturn = await this.appointmentRepository.findbyDate(day, appointment.user);
    appointment.start = new Date(appointment.start);
    appointment.start.setTime(appointment.start.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

    if (!dateReturn) {
      appointment.end = null;
      await this.appointmentRepository.save(appointment);
    } else {
      const updateQueryParams = JSON.parse(JSON.stringify(dateReturn));
      delete updateQueryParams._id;
      updateQueryParams.end = new Date(appointment.start);
      await this.appointmentRepository.update(dateReturn._id.toString(), updateQueryParams)
    }
  }

  public async update(id: string, appointment) {
    const appointmentExists = await this.find(id);

    if (!appointmentExists) {
      throw Error('This appointment does not exist')
    }

    await this.appointmentRepository.update(id, appointment);
  }

  public async remove(id: string) {
    await this.appointmentRepository.remove(id);
  }

  public setDateParameter(day) {
    day.start.setHours(0);
    day.start.setMinutes(0);
    day.start.setSeconds(0);
    day.start.setMilliseconds(0);
    day.start.setTime(day.start.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

    day.end.setHours(23);
    day.end.setMinutes(59);
    day.end.setSeconds(59);
    day.end.setMilliseconds(0);
    day.end.setTime(day.end.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
  }
}
