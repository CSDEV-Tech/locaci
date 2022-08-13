import { z } from 'zod';

export const UpdateListingRequestSchema = z.object({
    propertyId: z.string().uuid(),
    userId: z.string().uuid(),
    listingId: z.string().uuid(),
    active: z.boolean().optional(),
    description: z.string().min(15).optional(),
    availableFrom: z
        .date()
        .refine(
            date => date >= new Date(),
            'The date provided must be in the future'
        )
        .optional(),
    housingFee: z.number().min(1).optional(),
    housingPeriod: z.number().min(1).optional(),
    noOfFreeBedRooms: z.number().min(1).optional(),
    cautionMonthsPaymentAdvance: z.number().min(0).optional(),
    agencyMonthsPaymentAdvance: z.number().min(0).optional()
});

export type UpdateListingRequest = z.infer<typeof UpdateListingRequestSchema>;
