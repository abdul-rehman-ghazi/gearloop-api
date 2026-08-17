import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(user: UserAuthContext): Promise<{
        [key: string]: unknown;
    }>;
    update(user: UserAuthContext, dto: UpdateUserDto): Promise<{
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
}
