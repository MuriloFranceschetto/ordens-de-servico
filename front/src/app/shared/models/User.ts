export interface IUser {
    id: string;
    name: string;
    roles: UserRole[];
    active: boolean;
}

export interface ICompleteUser extends IUser {
    active: boolean;
    pricePerHour: number;
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
    email: string;
    phone: string;
}

export enum UserRole {
    Admin = 'Admin',
    Worker = 'Worker',
    Client = 'Client',
    Third = 'Third',
}

export const USER_ROLES_OPTIONS: { label: string, value: UserRole }[] = [
    { label: 'Administrador', value: UserRole.Admin },
    { label: 'Mecânico', value: UserRole.Worker },
    { label: 'Cliente', value: UserRole.Client },
    { label: 'Terceiro', value: UserRole.Third },
]
