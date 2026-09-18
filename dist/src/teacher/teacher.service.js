"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const supabase_1 = require("../lib/supabase");
const prisma_1 = require("../lib/prisma");
let TeacherService = class TeacherService {
    async getStats(school) {
        const scope = school ? { school } : {};
        const activityScope = school ? { user: { school } } : {};
        const [totalStudents, classGroups, totalCourses, avg, recentProgress, topStudents] = await Promise.all([
            prisma_1.prisma.user.count({ where: { ...scope, role: 'STUDENT' } }),
            prisma_1.prisma.user.groupBy({
                by: ['className'],
                where: { ...scope, role: 'STUDENT', className: { not: null } },
                _count: { _all: true },
            }),
            prisma_1.prisma.course.count({ where: { isHidden: false, ...scope } }),
            prisma_1.prisma.progress.aggregate({ where: activityScope, _avg: { score: true } }),
            prisma_1.prisma.progress.findMany({
                where: { completed: true, completedAt: { not: null }, ...activityScope },
                orderBy: { completedAt: 'desc' },
                take: 5,
                include: {
                    user: { select: { name: true } },
                    lesson: { select: { title: true } },
                },
            }),
            prisma_1.prisma.user.findMany({
                where: { ...scope, role: 'STUDENT' },
                orderBy: { xp: 'desc' },
                take: 3,
                select: { id: true, name: true, xp: true, level: true },
            }),
        ]);
        return {
            totalStudents,
            activeClasses: classGroups.length,
            totalCourses,
            averageScore: avg._avg.score ? Math.round(avg._avg.score * 10) / 10 : null,
            recentActivity: recentProgress.map((p) => ({
                id: p.id,
                userName: p.user.name,
                lessonTitle: p.lesson.title,
                score: p.score,
                completedAt: p.completedAt,
            })),
            topStudents,
        };
    }
    async getClasses(school) {
        const students = await prisma_1.prisma.user.findMany({
            where: { role: 'STUDENT', ...(school ? { school } : {}) },
            select: { id: true, name: true, className: true, xp: true, level: true, isSuspended: true },
            orderBy: { name: 'asc' },
        });
        const map = new Map();
        for (const s of students) {
            const key = s.className || 'Tanpa Kelas';
            if (!map.has(key))
                map.set(key, []);
            map.get(key).push(s);
        }
        return Array.from(map.entries()).map(([className, list]) => ({
            className,
            count: list.length,
            avgXp: Math.round(list.reduce((a, b) => a + b.xp, 0) / list.length),
            students: list,
        }));
    }
    async updateAssignments(courseId, classes) {
        const course = await prisma_1.prisma.course.findUnique({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Kursus tidak ditemukan');
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.courseAssignment.deleteMany({ where: { courseId } }),
            ...(classes?.length
                ? [
                    prisma_1.prisma.courseAssignment.createMany({
                        data: classes.map((c) => ({ courseId, className: c })),
                    }),
                ]
                : []),
        ]);
        return { ok: true };
    }
    async getMaterials(school) {
        return prisma_1.prisma.course.findMany({
            where: { isHidden: false, ...(school ? { school } : {}) },
            orderBy: { createdAt: 'asc' },
            include: {
                lessons: { select: { id: true, title: true } },
                assignments: { select: { className: true }, orderBy: { className: 'asc' } },
            },
        });
    }
    async getGrading(school) {
        return prisma_1.prisma.progress.findMany({
            where: { completed: true, ...(school ? { user: { school } } : {}) },
            orderBy: { completedAt: 'desc' },
            take: 30,
            include: {
                user: { select: { name: true, className: true } },
                lesson: { select: { title: true } },
            },
        });
    }
    async getReports(school) {
        const students = await prisma_1.prisma.user.findMany({
            where: { role: 'STUDENT', ...(school ? { school } : {}) },
            select: { id: true, className: true },
        });
        const progress = await prisma_1.prisma.progress.findMany({
            where: { completed: true, ...(school ? { user: { school } } : {}) },
            select: { userId: true, score: true },
        });
        const classOf = new Map(students.map((s) => [s.id, s.className || 'Tanpa Kelas']));
        const result = new Map();
        for (const s of students) {
            const cls = s.className || 'Tanpa Kelas';
            if (!result.has(cls))
                result.set(cls, { students: 0, completions: 0, scores: [] });
            result.get(cls).students++;
        }
        for (const p of progress) {
            const cls = classOf.get(p.userId);
            if (!cls)
                continue;
            const e = result.get(cls);
            e.completions++;
            if (p.score != null)
                e.scores.push(p.score);
        }
        return Array.from(result.entries()).map(([className, e]) => ({
            className,
            students: e.students,
            completions: e.completions,
            avgScore: e.scores.length
                ? Math.round(e.scores.reduce((a, b) => a + b, 0) / e.scores.length)
                : null,
        }));
    }
    async createCourse(data) {
        if (!data.title?.trim() || !data.description?.trim()) {
            throw new common_1.BadRequestException('Judul dan deskripsi wajib diisi');
        }
        const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
            '-' +
            Date.now().toString(36);
        const classes = [...new Set((data.classes ?? []).map((c) => c.trim()).filter(Boolean))];
        const course = await prisma_1.prisma.course.create({
            data: {
                title: data.title.trim(),
                description: data.description.trim(),
                emoji: data.emoji || '📚',
                color: data.color || 'bg-blue-500/10',
                slug,
                school: data.school ?? null,
                assignments: classes.length
                    ? { create: classes.map((className) => ({ className })) }
                    : undefined,
            },
            include: { assignments: true },
        });
        return course;
    }
    async createLesson(courseId, data) {
        const course = await prisma_1.prisma.course.findUnique({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Kursus tidak ditemukan');
        if (!data.title?.trim() || !data.content?.trim()) {
            throw new common_1.BadRequestException('Judul dan isi pelajaran wajib diisi');
        }
        return prisma_1.prisma.lesson.create({
            data: {
                title: data.title.trim(),
                content: data.content.trim(),
                courseId,
            },
        });
    }
    async extractText(file) {
        if (!file)
            throw new common_1.BadRequestException('Tidak ada file diunggah');
        const ext = (file.originalname.split('.').pop() || '').toLowerCase();
        if (ext === 'txt' || ext === 'md') {
            return { text: file.buffer.toString('utf-8') };
        }
        if (ext === 'docx') {
            const mammoth = require('mammoth');
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            return { text: result.value };
        }
        if (ext === 'pdf') {
            const pdfParse = require('pdf-parse');
            const data = await pdfParse(file.buffer);
            return { text: data.text };
        }
        throw new common_1.BadRequestException('Format tidak didukung. Gunakan .pdf, .docx, .txt, atau .md');
    }
    async getLesson(id) {
        const lesson = await prisma_1.prisma.lesson.findUnique({
            where: { id },
            include: { course: { select: { title: true } } },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Pelajaran tidak ditemukan');
        return lesson;
    }
    async updateLesson(id, data) {
        const lesson = await prisma_1.prisma.lesson.findUnique({ where: { id } });
        if (!lesson)
            throw new common_1.NotFoundException('Pelajaran tidak ditemukan');
        return prisma_1.prisma.lesson.update({
            where: { id },
            data: {
                title: data.title?.trim() || lesson.title,
                content: data.content?.trim() || lesson.content,
            },
        });
    }
    async deleteLesson(id) {
        const lesson = await prisma_1.prisma.lesson.findUnique({ where: { id } });
        if (!lesson)
            throw new common_1.NotFoundException('Pelajaran tidak ditemukan');
        return prisma_1.prisma.lesson.delete({ where: { id } });
    }
    async uploadImage(file) {
        if (!file)
            throw new common_1.BadRequestException('Tidak ada file diunggah');
        const ext = (file.originalname.split('.').pop() || 'png').toLowerCase();
        if (!['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) {
            throw new common_1.BadRequestException('Format gambar tidak didukung (png/jpg/webp/gif)');
        }
        const path = `lessons/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase_1.supabase.storage
            .from('lesson-assets')
            .upload(path, file.buffer, { contentType: file.mimetype });
        if (error)
            throw new common_1.BadRequestException('Gagal mengunggah gambar: ' + error.message);
        const { data } = supabase_1.supabase.storage.from('lesson-assets').getPublicUrl(path);
        return { url: data.publicUrl };
    }
    async deleteCourse(id) {
        const course = await prisma_1.prisma.course.findUnique({ where: { id } });
        if (!course)
            throw new common_1.NotFoundException('Materi tidak ditemukan');
        return prisma_1.prisma.course.delete({ where: { id } });
    }
};
exports.TeacherService = TeacherService;
exports.TeacherService = TeacherService = __decorate([
    (0, common_1.Injectable)()
], TeacherService);
//# sourceMappingURL=teacher.service.js.map