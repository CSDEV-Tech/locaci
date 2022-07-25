import { z } from 'zod';

export const AddListingForPropertyRequestSchema = z.object({
    propertyId: z.string().uuid(),
    description: z.string().min(15),
    availableFrom: z
        .date()
        .refine(
            date => date >= new Date(),
            'The date provided must be in the future'
        ),
    housingFee: z.number().min(1),
    housingPeriod: z.number().min(1).optional(),
    noOfFreeBedRooms: z.number().min(1).optional(),
    cautionMonthsPaymentAdvance: z.number().min(0).optional(),
    agencyMonthsPaymentAdvance: z.number().min(0).optional(),
    userId: z.string().uuid()
});

export type AddListingForPropertyRequest = z.infer<
    typeof AddListingForPropertyRequestSchema
>;
