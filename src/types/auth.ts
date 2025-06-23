export interface User {
    id?: string;
    uid?: string;
    email: string | null;
    name?: string;
    displayName?: string | null;
    avatar?: string;
    photoURL?: string | null;
    role?: 'user' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
}
