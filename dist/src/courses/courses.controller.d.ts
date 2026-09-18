import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    getAllCourses(): Promise<({
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
    createCourse(body: any): Promise<{
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
    updateCourse(id: string, body: any): Promise<{
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
