"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../lib/prisma");
let CoursesService = class CoursesService {
    async findAll() {
        return prisma_1.prisma.course.findMany({
            where: { isHidden: false },
            include: { lessons: true },
        });
    }
    async create(data) {
        return prisma_1.prisma.course.create({
            data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                emoji: data.emoji,
                color: data.color,
                isLocked: data.isLocked || false,
            },
        });
    }
    async update(id, data) {
        return prisma_1.prisma.course.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
            },
        });
    }
    async delete(id) {
        return prisma_1.prisma.course.delete({
            where: { id },
        });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)()
], CoursesService);
//# sourceMappingURL=courses.service.js.map