export declare function fetchUsers(): Promise<any>;
export declare function updateUserRole(userId: string, role: 'STUDENT' | 'TEACHER' | 'ADMIN'): Promise<any>;
export declare function toggleUserSuspend(userId: string, suspend: boolean): Promise<any>;
export declare function updateCourseAssignments(courseId: string, classes: string[]): Promise<any>;
