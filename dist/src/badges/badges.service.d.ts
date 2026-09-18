export declare const BADGES: {
    slug: string;
    name: string;
    icon: string;
    description: string;
    check: (s: any) => any;
}[];
export declare class BadgeService {
    private refreshStreak;
    evaluate(userId: string, event?: {
        score?: number;
        maxStreak?: number;
    }): Promise<{
        slug: string;
        name: string;
        icon: string;
    }[]>;
}
