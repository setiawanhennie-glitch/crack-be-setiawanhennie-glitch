import { SchoolService } from './school.service';
export declare class SchoolController {
    private readonly schoolService;
    constructor(schoolService: SchoolService);
    findByCode(code: string): Promise<{
        name: string;
        address: string;
        classList: string[];
    }>;
    getMine(req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        code: string;
        address: string | null;
        principal: string | null;
        contactEmail: string | null;
        classList: string[];
    }>;
    updateMine(req: any, body: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        code: string;
        address: string | null;
        principal: string | null;
        contactEmail: string | null;
        classList: string[];
    }>;
    regenerate(req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        code: string;
        address: string | null;
        principal: string | null;
        contactEmail: string | null;
        classList: string[];
    }>;
}
