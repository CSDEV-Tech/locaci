import { Uuid } from '../../Dto';
import { Listing } from '../Listing';
import { User } from '../User';

/**
 * Entité pour gérer les locations
 */
export type Rental = {
    id: Uuid;
    startDate: Date | null;
    endDate: Date | null;
    status: RentalStatus;
    finalPrice: number | null;
    listing: Listing;
    applicant: User;
};

export enum RentalStatus {
    RESERVED = 'RESERVED',
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED'
}

export const RentalStatuses = Object.values(RentalStatus);
