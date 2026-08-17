import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    me(userId: string): Promise<{
        [key: string]: unknown;
    }>;
    update(userId: string, dto: UpdateUserDto): Promise<{
        [key: string]: unknown;
    }>;
    findPublicProfile(id: string): Promise<{
        id: string;
        name: string;
        initials: string;
        isOwner: boolean;
        memberSince: Date;
        responseTime: string | null;
    }>;
    private findByIdOrThrow;
    private sanitize;
}
