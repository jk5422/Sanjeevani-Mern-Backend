import { prisma } from '../../../shared/prisma';
import { AppError } from '../../../utils/AppError';
import { hashPassword, comparePassword, signToken } from '../utils/auth.utils';
import { z } from 'zod';
import { loginSchema, registerSchema } from '../validators/auth.schema';

type LoginInput = z.infer<typeof loginSchema>['body'];
type RegisterInput = z.infer<typeof registerSchema>['body'];

export class AuthService {
    // 1. Login User
    static async login(input: LoginInput) {
        const { email, password } = input;

        // A. Find User
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true, shopee: true },
        });

        if (!user || !user.isActive) {
            throw new AppError('Invalid email or password', 401);
        }

        // B. Verify Password
        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) {
            throw new AppError('Invalid email or password', 401);
        }

        // C. Generate Token
        const token = signToken({
            userId: user.id,
            role: user.role.name,
            shopeeId: user.shopeeId,
        });

        // D. Return sanitized user
        return {
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role.name,
                shopee: user.shopee.name,
            },
        };
    }

    // 2. Register User (Admin Only Action)
    static async register(input: RegisterInput) {
        const { email, password, role, shopeeId, ...rest } = input;

        // A. Check Exists
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            throw new AppError('Email already registered', 409);
        }

        // B. Find Role ID
        const roleRecord = await prisma.role.findUnique({
            where: { name: role },
        });
        if (!roleRecord) {
            throw new AppError('Invalid role specified', 400);
        }

        // C. Hash Password
        const hashedPassword = await hashPassword(password);

        // D. Create User
        const newUser = await prisma.user.create({
            data: {
                ...rest,
                email,
                passwordHash: hashedPassword,
                roleId: roleRecord.id, // Link to internal ID
                shopeeId,
            },
        });

        return {
            id: newUser.id,
            email: newUser.email,
            role: role,
        };
    }
}
