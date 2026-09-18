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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../lib/prisma");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const resend_1 = require("resend");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    }
    async register(name, email, password, school, className, role) {
        const safeRole = role === 'TEACHER' ? 'TEACHER' : 'STUDENT';
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser)
            throw new common_1.BadRequestException('Email sudah terdaftar');
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                school,
                className,
                role: safeRole,
                verificationToken: hashedOtp,
                tokenExpiresAt,
            },
        });
        try {
            await this.resend.emails.send({
                from: 'NusaSkillz <onboarding@resend.dev>',
                to: email,
                subject: 'Kode Verifikasi NusaSkillz',
                html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
            <h2 style="margin-bottom:8px">🎓 Kode Verifikasi NusaSkillz</h2>
            <p>Halo ${name}, masukkan kode berikut di halaman verifikasi:</p>
            <div style="background:#f3f4f6;border-radius:12px;padding:20px;text-align:center;margin:20px 0">
              <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#6366f1">${otp}</span>
            </div>
            <p style="color:#888;font-size:12px;margin-top:16px">
              Kode berlaku 15 menit. Jika kamu tidak mendaftar di NusaSkillz, abaikan email ini.
            </p>
          </div>
        `,
            });
        }
        catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            await prisma_1.prisma.user.delete({ where: { id: user.id } });
            throw new common_1.BadRequestException('Gagal mengirim email verifikasi. Silakan coba lagi.');
        }
        return { message: 'Registrasi berhasil. Silakan cek email Anda.' };
    }
    async verifyEmail(email, otp) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.BadRequestException('User tidak ditemukan');
        if (user.isVerified)
            throw new common_1.BadRequestException('Email sudah terverifikasi');
        const isValidOtp = await bcrypt.compare(otp, user.verificationToken);
        if (!isValidOtp || user.tokenExpiresAt < new Date()) {
            throw new common_1.BadRequestException('Kode OTP salah atau kedaluwarsa');
        }
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
                tokenExpiresAt: null
            },
        });
        return { message: 'Email berhasil diverifikasi! Silakan login.' };
    }
    async login(email, password) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Email atau password salah');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Email atau password salah');
        if (!user.isVerified) {
            throw new common_1.UnauthorizedException('Email belum terverifikasi. Silakan cek email Anda.');
        }
        if (user.isSuspended) {
            throw new common_1.UnauthorizedException('Akun Anda ditangguhkan. Silakan hubungi support@nusaskillz.id untuk informasi lebih lanjut.');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                school: user.school,
                className: user.className,
            },
        };
    }
    async forgotPassword(email) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            const expiry = new Date(Date.now() + 15 * 60 * 1000);
            await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { resetToken: token, resetTokenExpiry: expiry },
            });
            const link = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
            await this.resend.emails.send({
                from: process.env.RESEND_FROM || 'NusaSkillz <onboarding@resend.dev>',
                to: email,
                subject: 'Reset Password NusaSkillz',
                html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
            <h2>🔑 Reset Password</h2>
            <p>Halo ${user.name}, klik tombol di bawah untuk mengganti password Anda:</p>
            <a href="${link}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
              Reset Password
            </a>
            <p style="color:#888;font-size:12px;margin-top:16px">
              Tautan berlaku 15 menit. Jika Anda tidak meminta ini, abaikan email ini.
            </p>
          </div>
        `,
            });
        }
        return { message: 'Jika email terdaftar, tautan reset telah dikirim.' };
    }
    async resetPassword(token, newPassword) {
        const user = await prisma_1.prisma.user.findFirst({ where: { resetToken: token } });
        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            throw new common_1.BadRequestException('Tautan reset tidak valid atau kedaluwarsa');
        }
        if (!newPassword || newPassword.length < 8) {
            throw new common_1.BadRequestException('Password minimal 8 karakter');
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { password: hashed, resetToken: null, resetTokenExpiry: null },
        });
        return { message: 'Password berhasil diubah. Silakan masuk.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map