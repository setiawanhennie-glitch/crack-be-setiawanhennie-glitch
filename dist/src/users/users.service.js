"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let UsersService = class UsersService {
    async findAll(school) {
        return prisma.user.findMany({
            where: school ? { school } : undefined,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                school: true,
                className: true,
                isSuspended: true,
                isVerified: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getStats(school) {
        const scope = school ? { school } : {};
        const [totalStudents, totalTeachers, recentUsers, classDistribution] = await Promise.all([
            prisma.user.count({ where: { ...scope, role: 'STUDENT' } }),
            prisma.user.count({ where: { ...scope, role: 'TEACHER' } }),
            prisma.user.findMany({
                where: scope,
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { id: true, name: true, role: true, school: true, createdAt: true },
            }),
            prisma.user.groupBy({
                by: ['className'],
                where: { ...scope, role: 'STUDENT', className: { not: null } },
                _count: { _all: true },
                orderBy: { className: 'asc' },
            }),
        ]);
        return { totalStudents, totalTeachers, recentUsers, classDistribution };
    }
    async updateRole(userId, newRole, adminSchool) {
        if (newRole === 'ADMIN') {
            throw new common_1.BadRequestException('Admin sekolah tidak dapat membuat admin baru');
        }
        const target = await prisma.user.findUnique({ where: { id: userId } });
        if (!target)
            throw new common_1.NotFoundException('Pengguna tidak ditemukan');
        if (adminSchool && target.school !== adminSchool) {
            throw new common_1.ForbiddenException('Pengguna berada di luar sekolah Anda');
        }
        return prisma.user.update({ where: { id: userId }, data: { role: newRole } });
    }
    async toggleSuspend(userId, suspend, adminSchool, adminId) {
        if (userId === adminId) {
            throw new common_1.BadRequestException('Tidak dapat menangguhkan diri sendiri');
        }
        const target = await prisma.user.findUnique({ where: { id: userId } });
        if (!target)
            throw new common_1.NotFoundException('Pengguna tidak ditemukan');
        if (adminSchool && target.school !== adminSchool) {
            throw new common_1.ForbiddenException('Pengguna berada di luar sekolah Anda');
        }
        return prisma.user.update({ where: { id: userId }, data: { isSuspended: suspend } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map