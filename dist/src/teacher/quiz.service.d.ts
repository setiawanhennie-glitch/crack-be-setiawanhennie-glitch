import { QuestionType } from '@prisma/client';
import { BadgeService } from '../badges/badges.service';
export declare class QuizService {
    private readonly badgeService;
    constructor(badgeService: BadgeService);
    createQuiz(data: {
        title: string;
        lessonId?: string;
        timeLimit?: number | null;
        lives?: number | null;
        xpReward?: number;
        school?: string;
        questions: {
            type: QuestionType;
            prompt: string;
            options?: string[];
            answer: string;
            points?: number;
            pairs?: {
                left: string;
                right: string;
            }[];
        }[];
    }): Promise<{
        questions: {
            id: string;
            quizId: string;
            type: import(".prisma/client").$Enums.QuestionType;
            prompt: string;
            options: string[];
            answer: string;
            points: number;
            order: number;
            pairs: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: string;
        school: string | null;
        createdAt: Date;
        lessonId: string | null;
        title: string;
        timeLimit: number | null;
        lives: number | null;
        xpReward: number;
    }>;
    listQuizzes(lessonId?: string, school?: string): Promise<({
        lesson: {
            title: string;
        };
        _count: {
            questions: number;
        };
    } & {
        id: string;
        school: string | null;
        createdAt: Date;
        lessonId: string | null;
        title: string;
        timeLimit: number | null;
        lives: number | null;
        xpReward: number;
    })[]>;
    deleteQuiz(id: string): Promise<{
        id: string;
        school: string | null;
        createdAt: Date;
        lessonId: string | null;
        title: string;
        timeLimit: number | null;
        lives: number | null;
        xpReward: number;
    }>;
    getQuizForPlay(id: string): Promise<{
        lesson: {
            title: string;
        };
        questions: {
            id: string;
            type: import(".prisma/client").$Enums.QuestionType;
            prompt: string;
            options: string[];
            answer: string;
            points: number;
            order: number;
            pairs: import("@prisma/client/runtime/library").JsonValue;
        }[];
    } & {
        id: string;
        school: string | null;
        createdAt: Date;
        lessonId: string | null;
        title: string;
        timeLimit: number | null;
        lives: number | null;
        xpReward: number;
    }>;
    submitQuiz(quizId: string, userId: string, answers: {
        questionId: string;
        answer: string;
    }[]): Promise<{
        correct: number;
        total: number;
        score: number;
        xpEarned: number;
        maxStreak: number;
        results: {
            questionId: string;
            correct: boolean;
            correctAnswer: string;
        }[];
        newBadges: {
            slug: string;
            name: string;
            icon: string;
        }[];
    }>;
    private gradeOne;
    checkAnswer(quizId: string, questionId: string, given: string): Promise<{
        correct: boolean;
        displayAnswer: string;
    }>;
    getQuizForEdit(id: string, school?: string): Promise<{
        questions: {
            id: string;
            quizId: string;
            type: import(".prisma/client").$Enums.QuestionType;
            prompt: string;
            options: string[];
            answer: string;
            points: number;
            order: number;
            pairs: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: string;
        school: string | null;
        createdAt: Date;
        lessonId: string | null;
        title: string;
        timeLimit: number | null;
        lives: number | null;
        xpReward: number;
    }>;
    updateQuiz(id: string, data: {
        title: string;
        lessonId?: string;
        timeLimit?: number | null;
        lives?: number | null;
        xpReward?: number;
        questions: {
            type: any;
            prompt: string;
            options?: string[];
            answer: string;
            pairs?: {
                left: string;
                right: string;
            }[];
            points?: number;
        }[];
    }, school?: string): Promise<{
        id: string;
        school: string | null;
        createdAt: Date;
        lessonId: string | null;
        title: string;
        timeLimit: number | null;
        lives: number | null;
        xpReward: number;
    }>;
}
