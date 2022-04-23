import { Request, Response, NextFunction } from 'express';
import { IToken } from '../interfaces/IToken';
import jwt from 'jsonwebtoken';

export default function verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    try {
        const data = jwt.verify(refreshToken, `${process.env.APP_REFRESH_SECRET}`);

        const { userId } = data as IToken;

        req.userId = userId;

        return next();
    } catch {
        return res.status(401).json({msg: 'You are not authorized' });
    }
}