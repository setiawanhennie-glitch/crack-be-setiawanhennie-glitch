import { BadgeService } from '../badges/badges.service';
export declare class StudentService {
    private readonly badgeService;
    constructor(badgeService: BadgeService);
    getStats(userId: string): Promise<{
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
    getLesson(lessonId: string, userId?: string): Promise<{
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
    completeLesson(lessonId: string, userId: string): Promise<{
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
}
