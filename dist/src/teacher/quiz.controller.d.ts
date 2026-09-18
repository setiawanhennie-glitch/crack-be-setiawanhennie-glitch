import { QuizService } from './quiz.service';
export declare class TeacherQuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    create(req: any, body: any): Promise<{
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
    list(req: any, lessonId?: string): Promise<({
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
    remove(id: string): Promise<{
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
export declare class PlayQuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    getForPlay(id: string): Promise<{
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
    submit(id: string, req: any, answers: {
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
    check(id: string, body: {
        questionId: string;
        answer: string;
    }): Promise<{
        correct: boolean;
        displayAnswer: string;
    }>;
    getForEdit(req: any, id: string): Promise<{
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
    update(req: any, id: string, body: any): Promise<{
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
