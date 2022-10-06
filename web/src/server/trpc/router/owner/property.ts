import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { isOwner } from '@/server/trpc/middleware/auth';
import { t } from '@/server/trpc/trpc-server-root';
import { createPropertyRequestSchema } from '@/server/trpc/validation/property-schema';
import { CreatePropertyController } from '@/server/trpc/router/controllers/create-property.controller';

import type { SupabaseStorageClient } from '@supabase/storage-js';

const protectedProcedure = t.procedure.use(isOwner);
export const ownerRouter = t.router({
    getAll: protectedProcedure.query(async ({ ctx, input }) => {
        return ctx.prisma.property.findMany({
            where: {
                userId: ctx.user.id
            },
            include: {
                commune: true,
                city: true
            }
        });
    }),
    deleteFile: protectedProcedure
        .input(
            z.object({
                path: z.string(),
                type: z.enum(['image', 'document'])
            })
        )
        .mutation(async ({ ctx, input }) => {
            const bucket = input.type === 'image' ? 'images' : 'documents';

            const { error } = await (
                ctx.supabaseAdmin.storage as unknown as SupabaseStorageClient
            ) // We convert the storage option to a type because TS gives an error
                // and cannot determine the type of the mutation without explicitly typing it to supabase storage
                .from(bucket)
                .remove([input.path]);

            return {
                error,
                success: error === null
            };
        }),
    searchCityByName: t.procedure
        .input(
            z.object({
                name: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.prisma.city.findFirst({
                where: {
                    name: {
                        startsWith: input.name,
                        mode: 'insensitive'
                    }
                }
            });
        }),

    searchCommuneByName: t.procedure
        .input(
            z.object({
                name: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.prisma.municipality.findMany({
                where: {
                    name: {
                        contains: input.name,
                        mode: 'insensitive'
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            });
        }),
    searchLocalityByName: t.procedure
        .input(
            z.object({
                name: z.string(),
                communeUid: z.string().uuid()
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.prisma.locality.findMany({
                where: {
                    name: {
                        contains: input.name,
                        mode: 'insensitive'
                    },
                    municipalityId: input.communeUid
                },
                orderBy: {
                    name: 'asc'
                }
            });
        }),
    create: protectedProcedure
        .input(createPropertyRequestSchema)
        .mutation(async ({ ctx, input }) => {
            const res = await CreatePropertyController.handle({
                ctx,
                input: {
                    ...input
                }
            });

            if (res.error) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: res.error
                });
            }

            return res.property;
        })
});
