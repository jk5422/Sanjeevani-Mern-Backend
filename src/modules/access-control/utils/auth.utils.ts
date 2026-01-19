import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../../../config/env';

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = async (
    plain: string,
    hashed: string
): Promise<boolean> => {
    return bcrypt.compare(plain, hashed);
};

export const signToken = (payload: {
    userId: number;
    role: string;
    shopeeId: number;
}): string => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, config.JWT_SECRET);
};
