"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../lib/prisma");
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
let ModerationService = class ModerationService {
    async getStats() {
        const [open, resolvedWeek, hidden, suspended] = await Promise.all([
            prisma_1.prisma.report.count({ where: { status: 'OPEN' } }),
            prisma_1.prisma.report.count({
                where: {
                    status: 'RESOLVED',
                    resolvedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                },
            }),
            prisma_1.prisma.course.count({ where: { isHidden: true } }),
            prisma_1.prisma.user.count({ where: { isSuspended: true } }),
        ]);
        return { open, resolvedWeek, hidden, suspended };
    }
    async enrich(report) {
        const reporter = await prisma_1.prisma.user.findUnique({
            where: { id: report.reporterId },
            select: { name: true },
        });
        let targetName = '(tidak ditemukan)';
        if (report.targetType === 'CONTENT') {
            targetName =
                (await prisma_1.prisma.course.findUnique({ where: { id: report.targetId }, select: { title: true } }))?.title ??
                    targetName;
        }
        else {
            targetName =
                (await prisma_1.prisma.user.findUnique({ where: { id: report.targetId }, select: { name: true } }))?.name ??
                    targetName;
        }
        return { ...report, reporterName: reporter?.name ?? 'Anonim', targetName };
    }
    async getOpenReports() {
        const reports = await prisma_1.prisma.report.findMany({
            where: { status: 'OPEN' },
            orderBy: { createdAt: 'desc' },
        });
        return Promise.all(reports.map((r) => this.enrich(r)));
    }
    async getHistory() {
        const reports = await prisma_1.prisma.report.findMany({
            where: { status: { in: ['RESOLVED', 'DISMISSED'] } },
            orderBy: { resolvedAt: 'desc' },
        });
        return Promise.all(reports.map((r) => this.enrich(r)));
    }
    async resolveReport(reportId, action) {
        const report = await prisma_1.prisma.report.findUnique({ where: { id: reportId } });
        if (!report)
            throw new common_1.NotFoundException('Laporan tidak ditemukan');
        if (report.status !== 'OPEN')
            throw new common_1.BadRequestException('Laporan sudah diselesaikan');
        if (action === 'CONTENT_HIDDEN') {
            if (report.targetType !== 'CONTENT')
                throw new common_1.BadRequestException('Laporan ini bukan tentang konten');
            const course = await prisma_1.prisma.course.findUnique({ where: { id: report.targetId } });
            if (!course)
                throw new common_1.NotFoundException('Konten tidak ditemukan');
            await prisma_1.prisma.course.update({ where: { id: report.targetId }, data: { isHidden: true } });
        }
        if (action === 'USER_SUSPENDED') {
            if (report.targetType !== 'USER')
                throw new common_1.BadRequestException('Laporan ini bukan tentang pengguna');
            const target = await prisma_1.prisma.user.findUnique({ where: { id: report.targetId } });
            if (!target)
                throw new common_1.NotFoundException('Pengguna tidak ditemukan');
            await prisma_1.prisma.user.update({ where: { id: report.targetId }, data: { isSuspended: true } });
            await resend.emails.send({
                from: 'NusaSkillz <onboarding@resend.dev>',
                to: target.email,
                subject: '⚠️ Akun NusaSkillz Anda ditangguhkan',
                html: `<h2>Akun Anda ditangguhkan</h2><p>Halo ${target.name}, akun Anda ditangguhkan setelah tinjauan laporan. Hubungi support@nusaskillz.id untuk informasi lebih lanjut.</p>`,
            });
        }
        return prisma_1.prisma.report.update({
            where: { id: reportId },
            data: {
                status: action === 'IGNORED' ? 'DISMISSED' : 'RESOLVED',
                actionTaken: action,
                resolvedAt: new Date(),
            },
        });
    }
    async createReport(data) {
        if (!['CONTENT', 'USER'].includes(data.targetType)) {
            throw new common_1.BadRequestException('targetType tidak valid');
        }
        return prisma_1.prisma.report.create({ data });
    }
};
exports.ModerationService = ModerationService;
exports.ModerationService = ModerationService = __decorate([
    (0, common_1.Injectable)()
], ModerationService);
//# sourceMappingURL=moderation.service.js.map