import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import verifyRefreshToken from '../middlewares/refreshToken';

const authRouter = Router();

authRouter.post('/', async (req, res) => AuthController.authenticate(req,res)); // public
authRouter.post('/refresh', verifyRefreshToken, async (req, res) => AuthController.refreshToken(req,res));

export default authRouter;