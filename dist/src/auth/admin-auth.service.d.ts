import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
export declare class AdminAuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    signup(dto: AdminSignupDto): Promise<{
        accessToken: string;
        admin: {
            [key: string]: unknown;
        };
    }>;
    login(dto: AdminLoginDto): Promise<{
        accessToken: string;
        admin: {
            [key: string]: unknown;
        };
    }>;
    private signToken;
    private sanitize;
}
