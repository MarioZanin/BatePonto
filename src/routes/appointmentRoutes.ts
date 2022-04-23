import { Router } from 'express';
import AppointmentController from '../controllers/AppointmentController';
import verifyToken from '../middlewares/auth';

const appointmentRouter = Router();

appointmentRouter.get('/', verifyToken, async (req, res) => AppointmentController.findAll(req,res));
appointmentRouter.post('/', verifyToken, async (req, res) => AppointmentController.create(req,res));
appointmentRouter.get('/search', verifyToken, async (req, res) => AppointmentController.findByDate(req,res));
appointmentRouter.get('/:id', verifyToken, async (req, res) => AppointmentController.find(req,res));
appointmentRouter.delete('/:id', verifyToken, async (req, res) => AppointmentController.remove(req,res));
appointmentRouter.patch('/:id', verifyToken, async (req, res) => AppointmentController.update(req,res));

export default appointmentRouter;