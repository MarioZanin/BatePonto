import { Router } from 'express';

import userRouter from './userRoutes';
import appointmentRouter from './appointmentRoutes';
import authRouter from './authRoutes';

const routes = Router();

routes.use('/api/auth', authRouter);
routes.use('/api/user', userRouter);
routes.use('/api/appointment', appointmentRouter);

export { routes };