import { StudentService } from './student.service';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    getStats(req: any): Promise<{
        user: {
            level: number;
            name: string;
            id: string;
            xp: number;
            streak: number;
            school: string;
            className: string;
        };
        xpToNext: number;
        completedLessons: number;
        badges: {
            name: string;
            icon: string;
        }[];
        totalBadges: number;
        courses: {
            id: string;
            title: string;
            emoji: string;
            color: string;
            isLocked: boolean;
            total: number;
            done: number;
            nextLesson: string;
            nextLessonId: string;
            firstLessonId: string;
            description: string;
        }[];
        leaderboard: {
            rank: number;
            name: string;
            xp: number;
            isUser: boolean;
        }[];
    }>;
    completeLesson(id: string, req: any): Promise<{
        progress: {
            id: string;
            userId: string;
            lessonId: string;
            completed: boolean;
            score: number | null;
            completedAt: Date | null;
        };
        newBadges: {
            slug: string;
            name: string;
            icon: string;
        }[];
    }>;
    getLesson(id: string, req: any): Promise<{
        progress: {
            completed: boolean;
            score: number;
        }[];
        course: {
            title: string;
            emoji: string;
        };
        quizzes: {
            id: string;
            title: string;
            _count: {
                questions: number;
            };
            timeLimit: number;
            lives: number;
            xpReward: number;
        }[];
    } & {
        id: string;
        title: string;
        content: string;
        courseId: string;
    }>;
}
