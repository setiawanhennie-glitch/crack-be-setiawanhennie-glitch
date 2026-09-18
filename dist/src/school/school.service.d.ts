export declare function generateSchoolCode(name?: string): string;
export declare class SchoolService {
    findByCode(code: string): Promise<{
        name: string;
        address: string;
        classList: string[];
    }>;
    getMine(schoolName: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        code: string;
        address: string | null;
        principal: string | null;
        contactEmail: string | null;
        classList: string[];
    }>;
    updateMine(schoolName: string, data: {
        address?: string;
        principal?: string;
        contactEmail?: string;
        classList?: string[];
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        code: string;
        address: string | null;
        principal: string | null;
        contactEmail: string | null;
        classList: string[];
    }>;
    regenerateCode(schoolName: string): Promise<{
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
