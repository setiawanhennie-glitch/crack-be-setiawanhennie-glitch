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
exports.SuperController = void 0;
const common_1 = require("@nestjs/common");
const super_service_1 = require("./super.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/guards/roles.decorator");
let SuperController = class SuperController {
    constructor(superService) {
        this.superService = superService;
    }
    getStats() {
        return this.superService.getStats();
    }
    getSchools() {
        return this.superService.getSchools();
    }
    onboard(body) {
        return this.superService.onboardSchool(body);
    }
    getAdmins(id) {
        return this.superService.getSchoolAdmins(id);
    }
    addAdmin(id, body) {
        return this.superService.addSchoolAdmin(id, body);
    }
    suspend(id, suspend) {
        return this.superService.toggleAdminSuspend(id, suspend);
    }
};
exports.SuperController = SuperController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuperController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('schools'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuperController.prototype, "getSchools", null);
__decorate([
    (0, common_1.Post)('schools'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SuperController.prototype, "onboard", null);
__decorate([
    (0, common_1.Get)('schools/:id/admins'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuperController.prototype, "getAdmins", null);
__decorate([
    (0, common_1.Post)('schools/:id/admins'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuperController.prototype, "addAdmin", null);
__decorate([
    (0, common_1.Patch)('admins/:id/suspend'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('suspend')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], SuperController.prototype, "suspend", null);
exports.SuperController = SuperController = __decorate([
    (0, common_1.Controller)('super'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __metadata("design:paramtypes", [super_service_1.SuperService])
], SuperController);
//# sourceMappingURL=super.controller.js.map