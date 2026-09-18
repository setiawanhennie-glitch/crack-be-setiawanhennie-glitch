"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const courses_module_1 = require("./courses/courses.module");
const auth_module_1 = require("./auth/auth.module");
const contact_module_1 = require("./contact/contact.module");
const users_module_1 = require("./users/users.module");
const moderation_module_1 = require("./moderation/moderation.module");
const teacher_module_1 = require("./teacher/teacher.module");
const student_module_1 = require("./student/student.module");
const school_module_1 = require("./school/school.module");
const super_module_1 = require("./super/super.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [courses_module_1.CoursesModule, auth_module_1.AuthModule, contact_module_1.ContactModule, users_module_1.UsersModule, moderation_module_1.ModerationModule, teacher_module_1.TeacherModule, student_module_1.StudentModule, school_module_1.SchoolModule, super_module_1.SuperModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map