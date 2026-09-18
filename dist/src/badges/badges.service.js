"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeService = exports.BADGES = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../lib/prisma");
exports.BADGES = [
    { slug: 'langkah-pertama', name: 'Langkah Pertama', icon: '🌱', description: 'Selesaikan pelajaran pertamamu', check: (s) => s.completedLessons >= 1 },
    { slug: 'rajin-belajar', name: 'Rajin Belajar', icon: '📚', description: 'Selesaikan 10 pelajaran', check: (s) => s.completedLessons >= 10 },
    { slug: 'kuis-perdana', name: 'Kuis Perdana', icon: '🎯', description: 'Selesaikan kuis pertamamu', check: (s) => s.quizzesTaken >= 1 },
    { slug: 'kuis-sempurna', name: 'Kuis Sempurna', icon: '💯', description: 'Raih skor 100 pada sebuah kuis', check: (s) => s.hadPerfectQuiz },
    { slug: 'combo-x5', name: 'Combo x5', icon: '🔥', description: '5 jawaban benar beruntun dalam satu kuis', check: (s) => s.bestQuizStreak >= 5 },
    { slug: 'streak-3', name: 'Setia 3 Hari', icon: '⚡', description: 'Jaga streak 3 hari berturut-turut', check: (s) => s.streak >= 3 },
    { slug: 'streak-7', name: 'Seminggu Membara', icon: '🌟', description: 'Jaga streak 7 hari berturut-turut', check: (s) => s.streak >= 7 },
    { slug: 'level-5', name: 'Petualang Level 5', icon: '🚀', description: 'Capai level 5', check: (s) => s.level >= 5 },
    { slug: 'kolektor-xp', name: 'Kolektor XP', icon: '💎', description: 'Kumpulkan total 1000 XP', check: (s) => s.xp >= 1000 },
];
let BadgeService = class BadgeService {
    async refreshStreak(user) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
        const last = user.lastActiveAt ? new Date(user.lastActiveAt) : null;
        let streak = user.streak;
        if (!last || last < startOfYesterday)
            streak = 1;
        else if (last < startOfToday)
            streak = user.streak + 1;
        await prisma_1.prisma.user.update({ where: { id: user.id }, data: { streak, lastActiveAt: now } });
        return streak;
    }
    async evaluate(userId, event) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return [];
        const streak = await this.refreshStreak(user);
        const [completedLessons, quizzesTaken, perfectCount] = await Promise.all([
            prisma_1.prisma.progress.count({ where: { userId, completed: true } }),
            prisma_1.prisma.progress.count({ where: { userId, score: { not: null } } }),
            prisma_1.prisma.progress.count({ where: { userId, score: 100 } }),
        ]);
        const stats = {
            xp: user.xp,
            level: user.level,
            streak,
            completedLessons,
            quizzesTaken,
            hadPerfectQuiz: perfectCount > 0 || event?.score === 100,
            bestQuizStreak: event?.maxStreak ?? 0,
        };
        const newlyEarned = [];
        for (const def of exports.BADGES) {
            if (!def.check(stats))
                continue;
            const badge = await prisma_1.prisma.badge.upsert({
                where: { slug: def.slug },
                update: {},
                create: { slug: def.slug, name: def.name, icon: def.icon, description: def.description },
            });
            const existing = await prisma_1.prisma.userBadge.findUnique({
                where: { userId_badgeId: { userId, badgeId: badge.id } },
            });
            if (!existing) {
                await prisma_1.prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
                newlyEarned.push({ slug: def.slug, name: def.name, icon: def.icon });
            }
        }
        return newlyEarned;
    }
};
exports.BadgeService = BadgeService;
exports.BadgeService = BadgeService = __decorate([
    (0, common_1.Injectable)()
], BadgeService);
//# sourceMappingURL=badges.service.js.map