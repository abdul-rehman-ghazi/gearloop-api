"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const admin_auth_controller_1 = require("./admin-auth.controller");
const admin_auth_service_1 = require("./admin-auth.service");
const jwt_user_strategy_1 = require("./strategies/jwt-user.strategy");
const jwt_admin_strategy_1 = require("./strategies/jwt-admin.strategy");
const jwt_user_auth_guard_1 = require("./guards/jwt-user-auth.guard");
const jwt_admin_auth_guard_1 = require("./guards/jwt-admin-auth.guard");
const optional_jwt_user_auth_guard_1 = require("./guards/optional-jwt-user-auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule, jwt_1.JwtModule.register({})],
        controllers: [auth_controller_1.AuthController, admin_auth_controller_1.AdminAuthController],
        providers: [
            auth_service_1.AuthService,
            admin_auth_service_1.AdminAuthService,
            jwt_user_strategy_1.JwtUserStrategy,
            jwt_admin_strategy_1.JwtAdminStrategy,
            jwt_user_auth_guard_1.JwtUserAuthGuard,
            jwt_admin_auth_guard_1.JwtAdminAuthGuard,
            optional_jwt_user_auth_guard_1.OptionalJwtUserAuthGuard,
        ],
        exports: [jwt_user_auth_guard_1.JwtUserAuthGuard, jwt_admin_auth_guard_1.JwtAdminAuthGuard, optional_jwt_user_auth_guard_1.OptionalJwtUserAuthGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map