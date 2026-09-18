import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getStats(req: any): Promise<{
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
    findAll(req: any): Promise<{
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
    updateRole(id: string, role: 'STUDENT' | 'TEACHER' | 'ADMIN', req: any): Promise<{
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
    toggleSuspend(id: string, suspend: boolean, req: any): Promise<{
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
