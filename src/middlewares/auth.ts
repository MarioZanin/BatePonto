import { Request, Response, NextFunction } from 'express';
import { IToken } from '../interfaces/IToken';
import jwt from 'jsonwebtoken';

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.sendStatus(401);
    }

    const token = authorization.replace('Bearer', '').trim();

    try {
        const data = jwt.verify(token, `${process.env.APP_SECRET}`);
        
        const { userId } = data as IToken;

        req.userId = userId;
        
        return next();
    } catch {
        return res.status(401).json({msg: 'You are not authorized' });
    }
}