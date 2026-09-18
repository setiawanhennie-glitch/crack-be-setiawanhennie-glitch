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
exports.PlayQuizController = exports.TeacherQuizController = void 0;
const common_1 = require("@nestjs/common");
const quiz_service_1 = require("./quiz.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/guards/roles.decorator");
let TeacherQuizController = class TeacherQuizController {
    constructor(quizService) {
        this.quizService = quizService;
    }
    create(req, body) {
        return this.quizService.createQuiz({ ...body, school: req.user.school });
    }
    list(req, lessonId) {
        return this.quizService.listQuizzes(lessonId, req.user.school);
    }
    remove(id) {
        return this.quizService.deleteQuiz(id);
    }
};
exports.TeacherQuizController = TeacherQuizController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TeacherQuizController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TeacherQuizController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherQuizController.prototype, "remove", null);
exports.TeacherQuizController = TeacherQuizController = __decorate([
    (0, common_1.Controller)('teacher/quizzes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('TEACHER', 'ADMIN'),
    __metadata("design:paramtypes", [quiz_service_1.QuizService])
], TeacherQuizController);
let PlayQuizController = class PlayQuizController {
    constructor(quizService) {
        this.quizService = quizService;
    }
    getForPlay(id) {
        return this.quizService.getQuizForPlay(id);
    }
    submit(id, req, answers) {
        return this.quizService.submitQuiz(id, req.user.id, answers);
    }
    check(id, body) {
        return this.quizService.checkAnswer(id, body.questionId, body.answer);
    }
    getForEdit(req, id) {
        return this.quizService.getQuizForEdit(id, req.user.school);
    }
    update(req, id, body) {
        return this.quizService.updateQuiz(id, body, req.user.school);
    }
};
exports.PlayQuizController = PlayQuizController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlayQuizController.prototype, "getForPlay", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('answers')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Array]),
    __metadata("design:returntype", void 0)
], PlayQuizController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/check'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PlayQuizController.prototype, "check", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PlayQuizController.prototype, "getForEdit", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], PlayQuizController.prototype, "update", null);
exports.PlayQuizController = PlayQuizController = __decorate([
    (0, common_1.Controller)('quizzes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [quiz_service_1.QuizService])
], PlayQuizController);
//# sourceMappingURL=quiz.controller.js.map