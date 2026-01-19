import { Request, Response, NextFunction } from 'express';

const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
        return value.trim();
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, sanitizeValue(v)])
        );
    }
    return value;
};

export const sanitizeInput = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    req.body = sanitizeValue(req.body);
    req.query = sanitizeValue(req.query) as any;
    req.params = sanitizeValue(req.params) as any;
    next();
};
