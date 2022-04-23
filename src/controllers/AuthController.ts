import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserRepository from '../repositories/UserRepository';
import UserService from '../services/UserService';
import { IToken } from '../interfaces/IToken';

class AuthController {
    userRepository: UserRepository;
    service: UserService;

    constructor() {
        this.userRepository = new UserRepository();
        this.service = new UserService(this.userRepository);
    }

    public async authenticate(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            const user = await this.service.authValidate(email, password);

            const refreshToken = jwt.sign({ userId: user?._id, isAdmin: user?.isAdmin }, `${process.env.APP_REFRESH_SECRET}`, { expiresIn: '1800s' }); // 30 minutos
            const token = jwt.sign({ userId: user?._id, isAdmin: user?.isAdmin }, `${process.env.APP_SECRET}`, { expiresIn: '600s' }); // 10 minutes

            return res.status(200).json({ token: token, refreshToken: refreshToken });
        } catch {
            return res.status(500).json({ msg: 'Something went wrong' });
        }
    }

    public async refreshToken(req: Request, res: Response): Promise<Response> {
        try {
            const { refreshToken } = req.body;

            const refreshTokenDecode = jwt.decode(refreshToken) as IToken;

            const token = jwt.sign({ userId: refreshTokenDecode?.userId, isAdmin: refreshTokenDecode?.isAdmin }, `${process.env.APP_SECRET}`, { expiresIn: '600s' });

            return res.status(200).json({ token: token });
        } catch {
            return res.status(500).json({ msg: 'Something went wrong' });
        }
    }
}

export default new AuthController();