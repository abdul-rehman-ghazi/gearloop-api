import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    signup(dto: SignupDto): Promise<{
        accessToken: string;
        user: {
            [key: string]: unknown;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            [key: string]: unknown;
        };
    }>;
    private signToken;
    private sanitize;
}
