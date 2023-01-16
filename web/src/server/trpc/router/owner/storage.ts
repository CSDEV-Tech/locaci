import { TRPCError } from '@trpc/server';
import S3 from 'aws-sdk/clients/s3.js';

import { t } from '~/server/trpc/root';
import { isOwner } from '~/server/trpc/middleware/auth';
import { z } from 'zod';
import { env } from '~/env/server.mjs';

const r2 = new S3({
    endpoint: `https://${env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    accessKeyId: `${env.CF_ACCESS_KEY_ID}`,
    secretAccessKey: `${env.CF_ACCESS_KEY_SECRET}`,
    signatureVersion: 'v4'
});
const protectedProcedure = t.procedure.use(isOwner);
export const ownerStorageRouter = t.router({
    generatePresignedURLForImage: protectedProcedure
        .input(
            z.object({
                name: z.string()
            })
        )
        .query(async ({ input }) => {
            // Update bucket cors rules
            const { $response } = await r2
                .putBucketCors({
                    Bucket: env.CF_IMAGES_BUCKET_NAME,
                    CORSConfiguration: {
                        CORSRules: [
                            {
                                AllowedMethods: ['PUT'],
                                AllowedOrigins: [
                                    'http://localhost:3000',
                                    'https://locaci.fredkiss.dev',
                                    'https://locaci.net'
                                ],
                                AllowedHeaders: [
                                    'content-type',
                                    'cache-control'
                                ]
                            }
                        ]
                    }
                })
                .promise();

            if ($response.error) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: $response.error.message
                });
            }

            const url = await r2.getSignedUrlPromise('putObject', {
                Bucket: env.CF_IMAGES_BUCKET_NAME,
                Key: input.name,
                Expires: 5 * 60 // 5 minutes
            });

            return {
                url
            };
        }),
    deleteImages: protectedProcedure
        .input(
            z.object({
                paths: z.array(z.string())
            })
        )
        .mutation(async ({ input }) => {
            const { $response } = await r2
                .deleteObjects({
                    Delete: {
                        Objects: input.paths.map(path => ({ Key: path }))
                    },
                    Bucket: env.CF_IMAGES_BUCKET_NAME
                })
                .promise();

            if ($response.error) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: $response.error.message
                });
            }
        })
});
