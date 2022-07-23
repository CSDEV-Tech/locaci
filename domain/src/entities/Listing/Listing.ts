import { Uuid } from '../../Dto';
import { Property } from '../Property';

export type Listing = {
    id: Uuid;
    property: Property;
    description: string;
    availableFrom: Date;
    housingFee: number;
    housingPeriod: number;
    active: boolean;
    noOfFreeBedRooms?: number;
    cautionMonthsPaymentAdvance?: number;
    agencyMonthsPaymentAdvance?: number;
};
