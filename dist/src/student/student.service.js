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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../lib/prisma");
const badges_service_1 = require("../badges/badges.service");
let StudentService = class StudentService {
    constructor(badgeService) {
        this.badgeService = badgeService;
    }
    async getStats(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, xp: true, level: true, streak: true, school: true, className: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Pengguna tidak ditemukan');
        const [progressRows, badges, courses, leaderboard] = await Promise.all([
            prisma_1.prisma.progress.findMany({
                where: { userId, completed: true },
                select: { lessonId: true },
            }),
            prisma_1.prisma.userBadge.findMany({
                where: { userId },
                include: { badge: { select: { name: true, icon: true } } },
            }),
            prisma_1.prisma.course.findMany({
                where: {
                    isHidden: false,
                    ...(user.school ? { school: user.school } : {}),
                    OR: [
                        { assignments: { none: {} } },
                        ...(user.className
                            ? [{ assignments: { some: { className: user.className } } }]
                            : []),
                    ],
                },
                include: { lessons: { select: { id: true, title: true } } },
                orderBy: { createdAt: 'asc' },
            }),
            prisma_1.prisma.user.findMany({
                where: { role: 'STUDENT', ...(user.school ? { school: user.school } : {}) },
                orderBy: { xp: 'desc' },
                take: 5,
                select: { id: true, name: true, xp: true },
            }),
        ]);
        const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
        const completedIds = new Set(progressRows.map((p) => p.lessonId));
        const coursesOut = courses.map((c) => {
            const done = c.lessons.filter((l) => completedIds.has(l.id)).length;
            const next = c.lessons.find((l) => !completedIds.has(l.id));
            return {
                id: c.id,
                title: c.title,
                emoji: c.emoji,
                color: c.color,
                isLocked: c.isLocked,
                total: c.lessons.length,
                done,
                nextLesson: next?.title ?? null,
                nextLessonId: next?.id ?? null,
                firstLessonId: c.lessons[0]?.id ?? null,
                description: c.description,
            };
        });
        return {
            user,
            xpToNext: user.level * 500,
            completedLessons: completedIds.size,
            badges: badges.map((b) => ({ name: b.badge.name, icon: b.badge.icon })),
            totalBadges: badges_service_1.BADGES.length,
            courses: coursesOut,
            leaderboard: leaderboard.map((u, i) => ({
                rank: i + 1,
                name: u.name,
                xp: u.xp,
                isUser: u.id === userId,
            })),
        };
    }
    async getLesson(lessonId, userId) {
        const lesson = await prisma_1.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                course: { select: { title: true, emoji: true } },
                quizzes: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        timeLimit: true,
                        lives: true,
                        xpReward: true,
                        _count: { select: { questions: true } },
                    },
                },
                ...(userId
                    ? { progress: { where: { userId }, select: { completed: true, score: true } } }
                    : {}),
            },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Pelajaran tidak ditemukan');
        return lesson;
    }
    async completeLesson(lessonId, userId) {
        const lesson = await prisma_1.prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson)
            throw new common_1.NotFoundException('Pelajaran tidak ditemukan');
        const progress = await prisma_1.prisma.progress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            update: { completed: true, completedAt: new Date() },
            create: { userId, lessonId, completed: true, completedAt: new Date() },
        });
        const newBadges = await this.badgeService.evaluate(userId);
        return { progress, newBadges };
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [badges_service_1.BadgeService])
], StudentService);
//# sourceMappingURL=student.service.js.map