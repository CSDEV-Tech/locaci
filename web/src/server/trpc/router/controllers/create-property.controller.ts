import { createPropertyRequestSchema } from '@/server/trpc/validation/property-schema';
import { RoomType, AmenityType } from '@prisma/client';

import type { Context } from '@/server/trpc/context';
import type { z } from 'zod';
import type { User, Room, Amenity, RentType } from '@prisma/client';

export class CreatePropertyController {
    static async handle({
        input,
        ctx
    }: {
        ctx: Omit<Context, 'user'> & {
            user: User;
        };
        input: z.TypeOf<typeof createPropertyRequestSchema>;
    }) {
        // base object for creating a property
        const propertyCreated = {
            archived: false,
            noOfRooms: 1,
            surfaceArea: input.surfaceArea,
            latitude: input.latitude,
            longitude: input.longitude,
            geoData: input.geoJSON,
            localityId: input.localityUid,
            cityId: input.cityUid,
            municipalityId: input.communeUid,
            rentType: input.rentType as RentType,
            localityName: input.localityName,
            userId: ctx.user.id,
            addressInstructions: input.addressInstructions ?? null,
            images: input.images
        };

        /**
         * ADD Rooms to the property
         */
        const propertyRooms: Array<
            Omit<Room, 'id' | 'property' | 'propertyId'>
        > = [
            {
                type: 'BEDROOM' // a default bedroom
            }
        ];

        for (const room of input.additionalRooms) {
            propertyRooms.push(room);

            // the rooms that are counted in the display of the total number of rooms
            const roomCountedInDisplayOfTotal = [
                RoomType.BEDROOM,
                RoomType.LIVING_ROOM,
                RoomType.KITCHEN
            ] as Array<RoomType>;

            if (roomCountedInDisplayOfTotal.includes(room.type)) {
                propertyCreated.noOfRooms = propertyCreated.noOfRooms + 1;
            }
        }

        /**
         * ADD Amenities to the property
         * This is only possible if the property is a short term property
         */
        if (input.rentType !== 'SHORT_TERM' && input.amenities.length > 0) {
            return {
                error: `Il n'est possible d'ajouter des accessoires qu'à une propriété de type court-séjour (meublée)`
            };
        }

        const amenities: Array<
            Omit<Amenity, 'id' | 'property' | 'propertyId'>
        > = [];

        for (const amenity of input.amenities) {
            if (isCustomAmenity(amenity)) {
                amenities.push({
                    name: amenity.name,
                    type: 'OTHER'
                });
            } else {
                amenities.push({
                    name: null,
                    type: amenity.type
                });
            }
        }

        /**
         * Create the property in the DB
         */
        const property = await ctx.prisma.property.create({
            data: {
                ...propertyCreated,
                rooms: {
                    createMany: {
                        data: propertyRooms
                    }
                },
                amenities: {
                    createMany: {
                        data: amenities
                    }
                }
            }
        });

        return {
            property
        };
    }
}

export function isCustomAmenity(
    amenity:
        | {
              type: AmenityType;
          }
        | {
              name: string;
          }
): amenity is { name: string } {
    return amenity.hasOwnProperty('name');
}
