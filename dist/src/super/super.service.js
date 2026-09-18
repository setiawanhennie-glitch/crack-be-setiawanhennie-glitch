"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const school_service_1 = require("../school/school.service");
const prisma = new client_1.PrismaClient();
let SuperService = class SuperService {
    async getStats() {
        const [schools, students, teachers, admins, xpAgg] = await Promise.all([
            prisma.school.count(),
            prisma.user.count({ where: { role: 'STUDENT' } }),
            prisma.user.count({ where: { role: 'TEACHER' } }),
            prisma.user.count({ where: { role: 'ADMIN' } }),
            prisma.user.aggregate({ _sum: { xp: true } }),
        ]);
        return {
            schools,
            students,
            teachers,
            admins,
            totalXp: xpAgg._sum.xp ?? 0,
        };
    }
    async getSchools() {
        const [schools, counts] = await Promise.all([
            prisma.school.findMany({ orderBy: { createdAt: 'desc' } }),
            prisma.user.groupBy({
                by: ['school', 'role'],
                where: { school: { not: null } },
                _count: { _all: true },
            }),
        ]);
        return schools.map((s) => {
            const rows = counts.filter((c) => c.school === s.name);
            const pick = (role) => rows.find((r) => r.role === role)?._count._all ?? 0;
            return { ...s, students: pick('STUDENT'), teachers: pick('TEACHER'), admins: pick('ADMIN') };
        });
    }
    async onboardSchool(data) {
        if (!data.schoolName?.trim())
            throw new common_1.BadRequestException('Nama sekolah wajib diisi');
        const existingSchool = await prisma.school.findUnique({ where: { name: data.schoolName.trim() } });
        if (existingSchool)
            throw new common_1.BadRequestException('Sekolah dengan nama ini sudah terdaftar');
        const existingUser = await prisma.user.findUnique({ where: { email: data.adminEmail?.toLowerCase() } });
        if (existingUser)
            throw new common_1.BadRequestException('Email admin sudah digunakan');
        if (!data.adminPassword || data.adminPassword.length < 8) {
            throw new common_1.BadRequestException('Password admin minimal 8 karakter');
        }
        const hashed = await bcrypt.hash(data.adminPassword, 10);
        const school = await prisma.$transaction(async (tx) => {
            const sch = await tx.school.create({
                data: {
                    name: data.schoolName.trim(),
                    code: (0, school_service_1.generateSchoolCode)(data.schoolName),
                    address: data.address,
                    principal: data.principal,
                    classList: data.classList?.length ? data.classList : ['10', '11', '12'],
                },
            });
            await tx.user.create({
                data: {
                    name: data.adminName.trim(),
                    email: data.adminEmail.trim().toLowerCase(),
                    password: hashed,
                    role: 'ADMIN',
                    school: sch.name,
                    isVerified: true,
                },
            });
            return sch;
        });
        return { school, code: school.code, adminEmail: data.adminEmail.trim().toLowerCase() };
    }
    async getSchoolAdmins(schoolId) {
        const school = await prisma.school.findUnique({ where: { id: schoolId } });
        if (!school)
            throw new common_1.NotFoundException('Sekolah tidak ditemukan');
        return prisma.user.findMany({
            where: { school: school.name, role: 'ADMIN' },
            select: { id: true, name: true, email: true, isSuspended: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
    }
    async addSchoolAdmin(schoolId, data) {
        const school = await prisma.school.findUnique({ where: { id: schoolId } });
        if (!school)
            throw new common_1.NotFoundException('Sekolah tidak ditemukan');
        const existing = await prisma.user.findUnique({ where: { email: data.email?.toLowerCase() } });
        if (existing)
            throw new common_1.BadRequestException('Email sudah digunakan');
        if (!data.password || data.password.length < 8)
            throw new common_1.BadRequestException('Password minimal 8 karakter');
        const hashed = await bcrypt.hash(data.password, 10);
        return prisma.user.create({
            data: {
                name: data.name.trim(),
                email: data.email.trim().toLowerCase(),
                password: hashed,
                role: 'ADMIN',
                school: school.name,
                isVerified: true,
            },
            select: { id: true, name: true, email: true },
        });
    }
    async toggleAdminSuspend(adminId, suspend) {
        const target = await prisma.user.findUnique({ where: { id: adminId } });
        if (!target || target.role !== 'ADMIN')
            throw new common_1.NotFoundException('Admin sekolah tidak ditemukan');
        return prisma.user.update({
            where: { id: adminId },
            data: { isSuspended: suspend },
            select: { id: true, name: true, isSuspended: true },
        });
    }
};
exports.SuperService = SuperService;
exports.SuperService = SuperService = __decorate([
    (0, common_1.Injectable)()
], SuperService);
//# sourceMappingURL=super.service.js.map