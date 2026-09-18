import { SuperService } from './super.service';
export declare class SuperController {
    private readonly superService;
    constructor(superService: SuperService);
    getStats(): Promise<{
        schools: number;
        students: number;
        teachers: number;
        admins: number;
        totalXp: number;
    }>;
    getSchools(): Promise<{
        students: number;
        teachers: number;
        admins: number;
        name: string;
        id: string;
        createdAt: Date;
        code: string;
        address: string | null;
        principal: string | null;
        contactEmail: string | null;
        classList: string[];
    }[]>;
    onboard(body: any): Promise<{
        school: {
            name: string;
            id: string;
            createdAt: Date;
            code: string;
            address: string | null;
            principal: string | null;
            contactEmail: string | null;
            classList: string[];
        };
        code: string;
        adminEmail: string;
    }>;
    getAdmins(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        isSuspended: boolean;
        createdAt: Date;
    }[]>;
    addAdmin(id: string, body: any): Promise<{
        name: string;
        id: string;
        email: string;
    }>;
    suspend(id: string, suspend: boolean): Promise<{
        name: string;
        id: string;
        isSuspended: boolean;
    }>;
}
