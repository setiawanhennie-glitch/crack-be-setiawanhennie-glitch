import { AuthService } from './auth.service';
declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    school?: string;
    className?: string;
    role?: 'STUDENT' | 'TEACHER';
}
declare class VerifyDto {
    email: string;
    otp: string;
}
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<{
        message: string;
    }>;
    verify(body: VerifyDto): Promise<{
        message: string;
    }>;
    login(body: LoginDto): Promise<{
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
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
export {};
