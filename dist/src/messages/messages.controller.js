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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const create_thread_dto_1 = require("./dto/create-thread.dto");
const send_message_dto_1 = require("./dto/send-message.dto");
const jwt_user_auth_guard_1 = require("../auth/guards/jwt-user-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let MessagesController = class MessagesController {
    messagesService;
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    createThread(user, dto) {
        return this.messagesService.createThread(user.userId, dto);
    }
    findThreads(user) {
        return this.messagesService.findThreadsForUser(user.userId);
    }
    findThreadById(user, id) {
        return this.messagesService.findThreadById(id, user.userId);
    }
    sendMessage(user, id, dto) {
        return this.messagesService.sendMessage(id, user.userId, dto);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)('threads'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_thread_dto_1.CreateThreadDto]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "createThread", null);
__decorate([
    (0, common_1.Get)('threads'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "findThreads", null);
__decorate([
    (0, common_1.Get)('threads/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "findThreadById", null);
__decorate([
    (0, common_1.Post)('threads/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "sendMessage", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.UseGuards)(jwt_user_auth_guard_1.JwtUserAuthGuard),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map