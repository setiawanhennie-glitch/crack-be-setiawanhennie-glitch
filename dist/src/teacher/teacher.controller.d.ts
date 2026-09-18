import { TeacherService } from './teacher.service';
export declare class TeacherController {
    private readonly teacherService;
    constructor(teacherService: TeacherService);
    getStats(req: any): Promise<{
        totalStudents: number;
        activeClasses: number;
        totalCourses: number;
        averageScore: number;
        recentActivity: {
            id: string;
            userName: string;
            lessonTitle: string;
            score: number;
            completedAt: Date;
        }[];
        topStudents: {
            level: number;
            name: string;
            id: string;
            xp: number;
        }[];
    }>;
    getClasses(req: any): Promise<{
        className: string;
        count: number;
        avgXp: number;
        students: {
            level: number;
            name: string;
            id: string;
            isSuspended: boolean;
            xp: number;
            className: string;
        }[];
    }[]>;
    getMaterials(req: any): Promise<({
        lessons: {
            id: string;
            title: string;
        }[];
        assignments: {
            className: string;
        }[];
    } & {
        id: string;
        school: string | null;
        createdAt: Date;
        title: string;
        slug: string;
        description: string;
        emoji: string;
        color: string;
        isLocked: boolean;
        isHidden: boolean;
        authorId: string | null;
    })[]>;
    getGrading(req: any): Promise<({
        user: {
            name: string;
            className: string;
        };
        lesson: {
            title: string;
        };
    } & {
        id: string;
        userId: string;
        lessonId: string;
        completed: boolean;
        score: number | null;
        completedAt: Date | null;
    })[]>;
    getReports(req: any): Promise<{
        className: string;
        students: number;
        completions: number;
        avgScore: number;
    }[]>;
    createCourse(req: any, body: {
        title: string;
        description: string;
        emoji: string;
        color: string;
        classes?: string[];
    }): Promise<{
        assignments: {
            id: string;
            className: string;
            courseId: string;
            assignedAt: Date;
        }[];
    } & {
        id: string;
        school: string | null;
        createdAt: Date;
        title: string;
        slug: string;
        description: string;
        emoji: string;
        color: string;
        isLocked: boolean;
        isHidden: boolean;
        authorId: string | null;
    }>;
    createLesson(id: string, body: {
        title: string;
        content: string;
    }): Promise<{
        id: string;
        title: string;
        content: string;
        courseId: string;
    }>;
    extract(file: any): Promise<{
        text: string;
    }>;
    getLesson(id: string): Promise<{
        course: {
            title: string;
        };
    } & {
        id: string;
        title: string;
        content: string;
        courseId: string;
    }>;
    updateLesson(id: string, body: {
        title?: string;
        content?: string;
    }): Promise<{
        id: string;
        title: string;
        content: string;
        courseId: string;
    }>;
    deleteLesson(id: string): Promise<{
        id: string;
        title: string;
        content: string;
        courseId: string;
    }>;
    upload(file: any): Promise<{
        url: string;
    }>;
    updateAssignments(id: string, classes: string[]): Promise<{
        ok: boolean;
    }>;
    deleteCourse(id: string): Promise<{
        id: string;
        school: string | null;
        createdAt: Date;
        title: string;
        slug: string;
        description: string;
        emoji: string;
        color: string;
        isLocked: boolean;
        isHidden: boolean;
        authorId: string | null;
    }>;
}
