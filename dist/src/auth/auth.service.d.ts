import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    private resend;
    constructor(jwtService: JwtService);
    register(name: string, email: string, password: string, school?: string, className?: string, role?: string): Promise<{
        message: string;
    }>;
    verifyEmail(email: string, otp: string): Promise<{
        message: string;
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            school: string;
            className: string;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
