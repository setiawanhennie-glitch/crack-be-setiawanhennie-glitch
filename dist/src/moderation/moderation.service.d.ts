export declare class ModerationService {
    getStats(): Promise<{
        open: number;
        resolvedWeek: number;
        hidden: number;
        suspended: number;
    }>;
    private enrich;
    getOpenReports(): Promise<any[]>;
    getHistory(): Promise<any[]>;
    resolveReport(reportId: string, action: 'IGNORED' | 'CONTENT_HIDDEN' | 'USER_SUSPENDED'): Promise<{
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
    createReport(data: {
        reporterId: string;
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
