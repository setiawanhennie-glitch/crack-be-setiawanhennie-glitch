import { Role } from '@prisma/client';
export declare class UsersService {
    findAll(school?: string): Promise<{
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isSuspended: boolean;
        school: string;
        className: string;
        isVerified: boolean;
        createdAt: Date;
    }[]>;
    getStats(school?: string): Promise<{
        totalStudents: number;
        totalTeachers: number;
        recentUsers: {
            name: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
            school: string;
            createdAt: Date;
        }[];
        classDistribution: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, "className"[]> & {
            _count: {
                _all: number;
            };
        })[];
    }>;
    updateRole(userId: string, newRole: Role, adminSchool?: string): Promise<{
        level: number;
        name: string;
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isSuspended: boolean;
        xp: number;
        streak: number;
        school: string | null;
        className: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        tokenExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        lastActiveAt: Date | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
    }>;
    toggleSuspend(userId: string, suspend: boolean, adminSchool?: string, adminId?: string): Promise<{
        level: number;
        name: string;
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isSuspended: boolean;
        xp: number;
        streak: number;
        school: string | null;
        className: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        tokenExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        lastActiveAt: Date | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
    }>;
}
