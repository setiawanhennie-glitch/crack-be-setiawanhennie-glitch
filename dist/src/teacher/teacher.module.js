"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const teacher_controller_1 = require("./teacher.controller");
const teacher_service_1 = require("./teacher.service");
const quiz_controller_1 = require("./quiz.controller");
const quiz_service_1 = require("./quiz.service");
const badges_service_1 = require("../badges/badges.service");
let TeacherModule = class TeacherModule {
};
exports.TeacherModule = TeacherModule;
exports.TeacherModule = TeacherModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '7d' },
            }),
        ],
        controllers: [teacher_controller_1.TeacherController, quiz_controller_1.TeacherQuizController, quiz_controller_1.PlayQuizController],
        providers: [teacher_service_1.TeacherService, quiz_service_1.QuizService, badges_service_1.BadgeService],
    })
], TeacherModule);
//# sourceMappingURL=teacher.module.js.map