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
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const badges_service_1 = require("../badges/badges.service");
const prisma_1 = require("../lib/prisma");
const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ');
let QuizService = class QuizService {
    constructor(badgeService) {
        this.badgeService = badgeService;
    }
    async createQuiz(data) {
        if (!data.title?.trim())
            throw new common_1.BadRequestException('Judul kuis wajib diisi');
        if (!data.questions?.length)
            throw new common_1.BadRequestException('Kuis butuh minimal 1 pertanyaan');
        for (const q of data.questions) {
            if (!q.prompt?.trim())
                throw new common_1.BadRequestException('Setiap pertanyaan wajib punya soal');
            if (q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE') {
                if (!q.options || q.options.length < 2)
                    throw new common_1.BadRequestException('Pilihan ganda butuh minimal 2 opsi');
                if (!q.options.includes(q.answer))
                    throw new common_1.BadRequestException('Jawaban benar harus salah satu opsi');
            }
            if (q.type === 'FILL_BLANK' || q.type === 'WORD_SCRAMBLE') {
                if (!q.answer?.trim())
                    throw new common_1.BadRequestException('Jawaban wajib diisi');
            }
            if (q.type === 'ORDERING') {
                if (!q.options || q.options.length < 3)
                    throw new common_1.BadRequestException('Urutkan butuh minimal 3 item');
            }
            if (q.type === 'MATCHING') {
                const pairs = q.pairs;
                if (!pairs || pairs.length < 2 || pairs.some((p) => !p.left?.trim() || !p.right?.trim())) {
                    throw new common_1.BadRequestException('Menjodohkan butuh minimal 2 pasangan lengkap');
                }
            }
        }
        return prisma_1.prisma.quiz.create({
            data: {
                title: data.title.trim(),
                lessonId: data.lessonId || null,
                timeLimit: data.timeLimit ?? null,
                lives: data.lives ?? null,
                xpReward: data.xpReward ?? 50,
                school: data.school ?? null,
                questions: {
                    create: data.questions.map((q, i) => ({
                        type: q.type,
                        prompt: q.prompt.trim(),
                        options: (q.options ?? []).map((o) => String(o).trim()).filter(Boolean),
                        answer: (q.answer ?? '').trim(),
                        pairs: q.type === 'MATCHING' ? q.pairs : undefined,
                        points: q.points ?? 10,
                        order: i,
                    })),
                },
            },
            include: { questions: true },
        });
    }
    async listQuizzes(lessonId, school) {
        return prisma_1.prisma.quiz.findMany({
            where: {
                ...(lessonId ? { lessonId } : {}),
                ...(school ? { school } : {}),
            },
            include: {
                _count: { select: { questions: true } },
                lesson: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteQuiz(id) {
        const quiz = await prisma_1.prisma.quiz.findUnique({ where: { id } });
        if (!quiz)
            throw new common_1.NotFoundException('Kuis tidak ditemukan');
        return prisma_1.prisma.quiz.delete({ where: { id } });
    }
    async getQuizForPlay(id) {
        const quiz = await prisma_1.prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    select: {
                        id: true,
                        type: true,
                        prompt: true,
                        options: true,
                        points: true,
                        order: true,
                        pairs: true,
                        answer: true,
                    },
                    orderBy: { order: 'asc' },
                },
                lesson: { select: { title: true } },
            },
        });
        if (!quiz)
            throw new common_1.NotFoundException('Kuis tidak ditemukan');
        quiz.questions = quiz.questions.map((q) => {
            const { answer, ...safe } = q;
            if (q.type === 'ORDERING') {
                const shuffled = [...q.options];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                if (shuffled.join('|') === q.options.join('|'))
                    shuffled.reverse();
                return { ...safe, options: shuffled };
            }
            if (q.type === 'WORD_SCRAMBLE') {
                const letters = (answer ?? '').split('');
                for (let i = letters.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [letters[i], letters[j]] = [letters[j], letters[i]];
                }
                if (letters.join('') === answer && letters.length > 1)
                    letters.reverse();
                return { ...safe, scrambledLetters: letters };
            }
            return safe;
        });
        return quiz;
    }
    async submitQuiz(quizId, userId, answers) {
        const quiz = await prisma_1.prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true },
        });
        if (!quiz)
            throw new common_1.NotFoundException('Kuis tidak ditemukan');
        const answerMap = new Map((answers || []).map((a) => [a.questionId, a.answer ?? '']));
        let correct = 0;
        let streak = 0;
        let maxStreak = 0;
        const results = quiz.questions
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((q) => {
            const given = answerMap.get(q.id) ?? '';
            let isCorrect = false;
            let displayAnswer = q.answer;
            if (q.type === 'FILL_BLANK' || q.type === 'WORD_SCRAMBLE') {
                isCorrect = given.trim() !== '' && normalize(given) === normalize(q.answer);
            }
            else if (q.type === 'ORDERING') {
                displayAnswer = q.options.join(' → ');
                try {
                    isCorrect = Array.isArray(JSON.parse(given)) && JSON.parse(given).join('|') === q.options.join('|');
                }
                catch {
                    isCorrect = false;
                }
            }
            else if (q.type === 'MATCHING') {
                const correct = q.pairs.map((p) => p.right);
                displayAnswer = q.pairs.map((p) => `${p.left} = ${p.right}`).join(', ');
                try {
                    isCorrect = Array.isArray(JSON.parse(given)) && JSON.parse(given).join('|') === correct.join('|');
                }
                catch {
                    isCorrect = false;
                }
            }
            else {
                isCorrect = given.trim() === q.answer;
            }
            if (isCorrect) {
                correct++;
                streak++;
                maxStreak = Math.max(maxStreak, streak);
            }
            else {
                streak = 0;
            }
            return { questionId: q.id, correct: isCorrect, correctAnswer: displayAnswer };
        });
        const total = quiz.questions.length;
        const score = Math.round((correct / total) * 100);
        const xpEarned = Math.round(quiz.xpReward * (correct / total)) + Math.max(0, maxStreak - 1) * 5;
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { xp: { increment: xpEarned } },
        });
        const newLevel = Math.floor(updatedUser.xp / 500) + 1;
        if (newLevel !== updatedUser.level) {
            await prisma_1.prisma.user.update({
                where: { id: userId },
                data: { level: newLevel }
            });
        }
        if (quiz.lessonId) {
            await prisma_1.prisma.progress.upsert({
                where: { userId_lessonId: { userId, lessonId: quiz.lessonId } },
                update: { completed: true, score, completedAt: new Date() },
                create: {
                    userId,
                    lessonId: quiz.lessonId,
                    completed: true,
                    score,
                    completedAt: new Date(),
                },
            });
        }
        const newBadges = await this.badgeService.evaluate(userId, { score, maxStreak });
        return { correct, total, score, xpEarned, maxStreak, results, newBadges };
    }
    gradeOne(q, given) {
        if (q.type === 'FILL_BLANK' || q.type === 'WORD_SCRAMBLE') {
            return {
                correct: given.trim() !== '' && normalize(given) === normalize(q.answer),
                displayAnswer: q.answer,
            };
        }
        if (q.type === 'ORDERING') {
            let correct = false;
            try {
                correct = Array.isArray(JSON.parse(given)) && JSON.parse(given).join('|') === q.options.join('|');
            }
            catch { }
            return { correct, displayAnswer: q.options.join(' → ') };
        }
        if (q.type === 'MATCHING') {
            const rights = q.pairs.map((p) => p.right);
            let correct = false;
            try {
                correct = Array.isArray(JSON.parse(given)) && JSON.parse(given).join('|') === rights.join('|');
            }
            catch { }
            return { correct, displayAnswer: q.pairs.map((p) => `${p.left} = ${p.right}`).join(', ') };
        }
        return { correct: given.trim() === q.answer, displayAnswer: q.answer };
    }
    async checkAnswer(quizId, questionId, given) {
        const q = await prisma_1.prisma.question.findUnique({ where: { id: questionId } });
        if (!q || q.quizId !== quizId)
            throw new common_1.NotFoundException('Pertanyaan tidak ditemukan');
        return this.gradeOne(q, given ?? '');
    }
    async getQuizForEdit(id, school) {
        const quiz = await prisma_1.prisma.quiz.findUnique({
            where: { id },
            include: { questions: { orderBy: { order: 'asc' } } },
        });
        if (!quiz)
            throw new common_1.NotFoundException('Kuis tidak ditemukan');
        if (school && quiz.school !== school)
            throw new common_1.NotFoundException('Kuis tidak ditemukan');
        return quiz;
    }
    async updateQuiz(id, data, school) {
        const quiz = await prisma_1.prisma.quiz.findUnique({ where: { id } });
        if (!quiz)
            throw new common_1.NotFoundException('Kuis tidak ditemukan');
        if (school && quiz.school !== school)
            throw new common_1.NotFoundException('Kuis tidak ditemukan');
        if (!data.title?.trim())
            throw new common_1.BadRequestException('Judul kuis wajib diisi');
        if (!data.questions?.length)
            throw new common_1.BadRequestException('Kuis butuh minimal 1 pertanyaan');
        for (const q of data.questions) {
            if (!q.prompt?.trim() || !q.answer?.trim())
                throw new common_1.BadRequestException('Setiap pertanyaan wajib punya soal dan jawaban');
            if (q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE') {
                if (!q.options || q.options.length < 2)
                    throw new common_1.BadRequestException('Pilihan ganda butuh minimal 2 opsi');
                if (!q.options.includes(q.answer))
                    throw new common_1.BadRequestException('Jawaban benar harus salah satu opsi');
            }
            if (q.type === 'ORDERING' && (!q.options || q.options.length < 3)) {
                throw new common_1.BadRequestException('Urutkan butuh minimal 3 item');
            }
            if (q.type === 'MATCHING') {
                const pairs = q.pairs;
                if (!pairs || pairs.length < 2 || pairs.some((p) => !p.left?.trim() || !p.right?.trim())) {
                    throw new common_1.BadRequestException('Menjodohkan butuh minimal 2 pasangan lengkap');
                }
            }
        }
        return prisma_1.prisma.$transaction(async (tx) => {
            const updated = await tx.quiz.update({
                where: { id },
                data: {
                    title: data.title.trim(),
                    lessonId: data.lessonId || null,
                    timeLimit: data.timeLimit ?? null,
                    lives: data.lives ?? null,
                    xpReward: data.xpReward ?? 50,
                },
            });
            await tx.question.deleteMany({ where: { quizId: id } });
            await tx.question.createMany({
                data: data.questions.map((q, i) => ({
                    quizId: id,
                    type: q.type,
                    prompt: q.prompt.trim(),
                    options: (q.options ?? []).map((o) => String(o).trim()).filter(Boolean),
                    answer: (q.answer ?? '').trim(),
                    pairs: q.type === 'MATCHING' ? q.pairs : undefined,
                    points: q.points ?? 10,
                    order: i,
                })),
            });
            return updated;
        });
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [badges_service_1.BadgeService])
], QuizService);
//# sourceMappingURL=quiz.service.js.map