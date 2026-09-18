import { ModerationService } from './moderation.service';
export declare class ModerationController {
    private readonly moderationService;
    constructor(moderationService: ModerationService);
    getStats(): Promise<{
        open: number;
        resolvedWeek: number;
        hidden: number;
        suspended: number;
    }>;
    getOpenReports(): Promise<any[]>;
    getHistory(): Promise<any[]>;
    resolve(id: string, action: 'IGNORED' | 'CONTENT_HIDDEN' | 'USER_SUSPENDED'): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        reporterId: string;
        targetType: string;
        targetId: string;
        reason: string;
        status: string;
        actionTaken: string | null;
        resolvedAt: Date | null;
    }>;
}
export declare class ReportsController {
    private readonly moderationService;
    constructor(moderationService: ModerationService);
    create(req: any, body: {
        targetType: string;
        targetId: string;
        reason: string;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        reporterId: string;
        targetType: string;
        targetId: string;
        reason: string;
        status: string;
        actionTaken: string | null;
        resolvedAt: Date | null;
    }>;
}
