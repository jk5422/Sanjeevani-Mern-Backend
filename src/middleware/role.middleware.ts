import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

// Factory function to restrict access to specific roles
export const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
};
