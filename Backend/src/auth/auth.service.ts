import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: { email: string; password: string }) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return {
            user,
            accessToken: 'mock_jwt_token_' + user.role + '_' + user.id, // For a "robust" plan without adding complex JWT dependencies yet
        };
    }

    async register(registerDto: any) {
        const existing = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });
        if (existing) {
            throw new UnauthorizedException('Email already registered');
        }

        const user = await this.prisma.user.create({
            data: {
                ...registerDto,
                role: 'CUSTOMER',
            },
        });

        const { password, ...result } = user;
        return {
            user: result,
            accessToken: 'mock_jwt_token_' + user.role + '_' + user.id,
        };
    }
}

