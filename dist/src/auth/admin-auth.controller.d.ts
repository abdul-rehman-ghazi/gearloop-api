import { AdminAuthService } from './admin-auth.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
export declare class AdminAuthController {
    private readonly adminAuthService;
    constructor(adminAuthService: AdminAuthService);
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
}
