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
exports.TeacherController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const teacher_service_1 = require("./teacher.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/guards/roles.decorator");
let TeacherController = class TeacherController {
    constructor(teacherService) {
        this.teacherService = teacherService;
    }
    getStats(req) {
        return this.teacherService.getStats(req.user.school);
    }
    getClasses(req) {
        return this.teacherService.getClasses(req.user.school);
    }
    getMaterials(req) {
        return this.teacherService.getMaterials(req.user.school);
    }
    getGrading(req) {
        return this.teacherService.getGrading(req.user.school);
    }
    getReports(req) {
        return this.teacherService.getReports(req.user.school);
    }
    createCourse(req, body) {
        return this.teacherService.createCourse({ ...body, school: req.user.school });
    }
    createLesson(id, body) {
        return this.teacherService.createLesson(id, body);
    }
    extract(file) {
        return this.teacherService.extractText(file);
    }
    getLesson(id) {
        return this.teacherService.getLesson(id);
    }
    updateLesson(id, body) {
        return this.teacherService.updateLesson(id, body);
    }
    deleteLesson(id) {
        return this.teacherService.deleteLesson(id);
    }
    upload(file) {
        return this.teacherService.uploadImage(file);
    }
    updateAssignments(id, classes) {
        return this.teacherService.updateAssignments(id, classes ?? []);
    }
    deleteCourse(id) {
        return this.teacherService.deleteCourse(id);
    }
};
exports.TeacherController = TeacherController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('classes'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getClasses", null);
__decorate([
    (0, common_1.Get)('materials'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getMaterials", null);
__decorate([
    (0, common_1.Get)('grading'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getGrading", null);
__decorate([
    (0, common_1.Get)('reports'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getReports", null);
__decorate([
    (0, common_1.Post)('courses'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Post)('courses/:id/lessons'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "createLesson", null);
__decorate([
    (0, common_1.Post)('extract'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "extract", null);
__decorate([
    (0, common_1.Get)('lessons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getLesson", null);
__decorate([
    (0, common_1.Patch)('lessons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "updateLesson", null);
__decorate([
    (0, common_1.Delete)('lessons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "deleteLesson", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "upload", null);
__decorate([
    (0, common_1.Patch)('courses/:id/assignments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('classes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "updateAssignments", null);
__decorate([
    (0, common_1.Delete)('courses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "deleteCourse", null);
exports.TeacherController = TeacherController = __decorate([
    (0, common_1.Controller)('teacher'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('TEACHER', 'ADMIN'),
    __metadata("design:paramtypes", [teacher_service_1.TeacherService])
], TeacherController);
//# sourceMappingURL=teacher.controller.js.map