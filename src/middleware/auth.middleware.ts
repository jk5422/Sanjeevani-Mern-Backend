import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../modules/access-control/auth.utils';
import { AppError } from '../utils/AppError';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                role: string;
                shopeeId: number;
            };
        }
    }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    // 1. Get Token
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in', 401));
    }

    // 2. Verify Token
    try {
        const decoded = verifyToken(token);
        // 3. Attach User to Request
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            shopeeId: decoded.shopeeId,
        };
        next();
    } catch (error) {
        return next(new AppError('Invalid token', 401));
    }
};
