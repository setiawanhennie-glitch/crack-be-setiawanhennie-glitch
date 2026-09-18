export declare class SuperService {
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
    onboardSchool(data: {
        schoolName: string;
        address?: string;
        principal?: string;
        classList?: string[];
        adminName: string;
        adminEmail: string;
        adminPassword: string;
    }): Promise<{
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
    getSchoolAdmins(schoolId: string): Promise<{
        name: string;
        id: string;
        email: string;
        isSuspended: boolean;
        createdAt: Date;
    }[]>;
    addSchoolAdmin(schoolId: string, data: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        name: string;
        id: string;
        email: string;
    }>;
    toggleAdminSuspend(adminId: string, suspend: boolean): Promise<{
        name: string;
        id: string;
        isSuspended: boolean;
    }>;
}
