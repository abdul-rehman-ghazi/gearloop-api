"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDisputesController = void 0;
const common_1 = require("@nestjs/common");
const disputes_service_1 = require("./disputes.service");
const update_dispute_status_dto_1 = require("./dto/update-dispute-status.dto");
const jwt_admin_auth_guard_1 = require("../auth/guards/jwt-admin-auth.guard");
let AdminDisputesController = class AdminDisputesController {
    disputesService;
    constructor(disputesService) {
        this.disputesService = disputesService;
    }
    findById(id) {
        return this.disputesService.findById(id);
    }
    updateStatus(id, dto) {
        return this.disputesService.updateStatus(id, dto);
    }
};
exports.AdminDisputesController = AdminDisputesController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminDisputesController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dispute_status_dto_1.UpdateDisputeStatusDto]),
    __metadata("design:returntype", void 0)
], AdminDisputesController.prototype, "updateStatus", null);
exports.AdminDisputesController = AdminDisputesController = __decorate([
    (0, common_1.UseGuards)(jwt_admin_auth_guard_1.JwtAdminAuthGuard),
    (0, common_1.Controller)('admin/disputes'),
    __metadata("design:paramtypes", [disputes_service_1.DisputesService])
], AdminDisputesController);
//# sourceMappingURL=admin-disputes.controller.js.map