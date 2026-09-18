export declare class CoursesService {
    findAll(): Promise<({
        lessons: {
            id: string;
            title: string;
            content: string;
            courseId: string;
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
    create(data: any): Promise<{
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
    update(id: string, data: any): Promise<{
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
    delete(id: string): Promise<{
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
