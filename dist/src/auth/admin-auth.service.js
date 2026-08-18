"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const initials_util_1 = require("./utils/initials.util");
let AdminAuthService = class AdminAuthService {
    prisma;
    jwtService;
    config;
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    async signup(dto) {
        const existing = await this.prisma.adminUser.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('An admin account with this email already exists');
        }
        const saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS', 10));
        const passwordHash = await bcrypt.hash(dto.password, saltRounds);
        const admin = await this.prisma.adminUser.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash,
                initials: (0, initials_util_1.computeInitials)(dto.name),
            },
        });
        return {
            accessToken: this.signToken({
                sub: admin.id,
                email: admin.email,
                type: 'admin',
            }),
            admin: this.sanitize(admin),
        };
    }
    async login(dto) {
        const admin = await this.prisma.adminUser.findUnique({
            where: { email: dto.email },
        });
        if (!admin)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const passwordMatches = await bcrypt.compare(dto.password, admin.passwordHash);
        if (!passwordMatches)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return {
            accessToken: this.signToken({
                sub: admin.id,
                email: admin.email,
                type: 'admin',
            }),
            admin: this.sanitize(admin),
        };
    }
    signToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.config.getOrThrow('JWT_ADMIN_SECRET'),
            expiresIn: this.config.get('JWT_ADMIN_EXPIRES_IN', '1d'),
        });
    }
    sanitize(admin) {
        const { passwordHash: _passwordHash, ...rest } = admin;
        return rest;
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map