export declare class ContactService {
    sendInquiry(data: {
        name: string;
        email: string;
        topic: string;
        message: string;
    }): Promise<{
        message: string;
    }>;
}
