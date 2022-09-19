import { Uuid } from '../../Dto';

export type User = {
    id: Uuid;
    firstName: string | null;
    lastName: string | null;
    role: Role;
    email: string;
    phoneNumber: string | null;
};

export enum Role {
    HOUSING_APPLICANT = 'HOUSING_APPLICANT',
    PROPERTY_OWNER = 'PROPERTY_OWNER',
    ADMIN = 'ADMIN'
}

export const Roles = Object.values(Role);
