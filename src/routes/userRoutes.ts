import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import UserController from '../controllers/UserController';
import verifyToken from '../middlewares/auth';

const userRouter = Router();

userRouter.post('/admin', async (req, res) => UserController.create(req,res)); // public
userRouter.post('/forgot', async (req, res) => UserController.forgotPassword(req,res)); // public
userRouter.get('/profile', verifyToken, async (req, res) => UserController.userInfo(req,res));
userRouter.patch('/profile', verifyToken, async (req, res) => UserController.update(req,res));

userRouter.get('/', verifyToken, async (req, res) => AdminController.listUsers(req,res));
userRouter.post('/employee', verifyToken, async (req, res) => AdminController.createUser(req,res));
userRouter.get('/employee', verifyToken, async (req, res) => AdminController.getUserByName(req,res));
userRouter.get('/:id', verifyToken, async (req, res) => AdminController.getUserById(req,res));
userRouter.patch('/:id', verifyToken, async (req, res) => AdminController.updateUser(req,res));
userRouter.delete('/:id', verifyToken, async (req, res) => AdminController.removeUser(req,res));

export default userRouter;