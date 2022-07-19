import { z } from 'zod';

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
    email: string;
    phoneNumber: string;
};

export enum Role {
    HOUSING_APPLICANT = 'HOUSING_APPLICANT',
    PROPERTY_OWNER = 'PROPERTY_OWNER',
    ADMIN = 'ADMIN'
}

export const Roles = Object.values(Role);
