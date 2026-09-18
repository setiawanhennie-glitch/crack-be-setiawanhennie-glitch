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
exports.SchoolService = void 0;
exports.generateSchoolCode = generateSchoolCode;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
const prisma = new client_1.PrismaClient();
function generateSchoolCode(name) {
    const prefix = (name || 'SCH').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'SCH';
    const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `${prefix}-${rand}`;
}
let SchoolService = class SchoolService {
    async findByCode(code) {
        const school = await prisma.school.findUnique({
            where: { code: code.trim().toUpperCase() },
        });
        if (!school)
            throw new common_1.NotFoundException('Kode sekolah tidak ditemukan');
        return { name: school.name, address: school.address, classList: school.classList };
    }
    async getMine(schoolName) {
        const school = await prisma.school.findUnique({ where: { name: schoolName } });
        if (!school)
            throw new common_1.NotFoundException('Sekolah belum terdaftar di sistem');
        return school;
    }
    async updateMine(schoolName, data) {
        const school = await prisma.school.findUnique({ where: { name: schoolName } });
        if (!school)
            throw new common_1.NotFoundException('Sekolah belum terdaftar di sistem');
        return prisma.school.update({
            where: { id: school.id },
            data: {
                address: data.address,
                principal: data.principal,
                contactEmail: data.contactEmail,
                classList: data.classList,
            },
        });
    }
    async regenerateCode(schoolName) {
        const school = await prisma.school.findUnique({ where: { name: schoolName } });
        if (!school)
            throw new common_1.NotFoundException('Sekolah belum terdaftar di sistem');
        return prisma.school.update({
            where: { id: school.id },
            data: { code: generateSchoolCode(school.name) },
        });
    }
};
exports.SchoolService = SchoolService;
exports.SchoolService = SchoolService = __decorate([
    (0, common_1.Injectable)()
], SchoolService);
//# sourceMappingURL=school.service.js.map