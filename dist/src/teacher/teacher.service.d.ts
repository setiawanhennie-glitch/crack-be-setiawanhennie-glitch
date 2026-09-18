export declare class TeacherService {
    getStats(school?: string): Promise<{
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
    getClasses(school?: string): Promise<{
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
    updateAssignments(courseId: string, classes: string[]): Promise<{
        ok: boolean;
    }>;
    getMaterials(school?: string): Promise<({
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
    getGrading(school?: string): Promise<({
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
    getReports(school?: string): Promise<{
        className: string;
        students: number;
        completions: number;
        avgScore: number;
    }[]>;
    createCourse(data: {
        title: string;
        description: string;
        emoji: string;
        color: string;
        classes?: string[];
        school?: string;
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
    createLesson(courseId: string, data: {
        title: string;
        content: string;
    }): Promise<{
        id: string;
        title: string;
        content: string;
        courseId: string;
    }>;
    extractText(file: any): Promise<{
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
    updateLesson(id: string, data: {
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
    uploadImage(file: any): Promise<{
        url: string;
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
