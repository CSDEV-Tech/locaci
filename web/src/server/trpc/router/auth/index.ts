import { verifyOtpSchema } from '~/validation/auth-schema';
import { z } from 'zod';
import { t } from '~/server/trpc/trpc-server-root';
import { TRPCError } from '@trpc/server';
import { Uuid } from '~/utils/uuid';
import { sendOtpSchema } from '~/validation/auth-schema';
import jwt from 'jsonwebtoken';

import { isLoggedIn } from '~/server/trpc/middleware/auth';
import { env } from '~/env/server.mjs';
import { apiFetch } from '~/utils/functions';

const protectedProcedure = t.procedure.use(isLoggedIn);

interface Auth0TokenResult {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
    error?: string;
    error_description?: string;
}

interface Auth0UserInfoResult {
    email: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    error?: string;
    error_description?: string;
}

const EXPIRED_CODE =
    'The verification code has expired. Please try to login again.';
const INVALID_CODE = 'Wrong email or verification code.';
const MAXIMUM_ATTEMPT =
    "You've reached the maximum number of attempts. Please try to login again.";

export const authRouter = t.router({
    sendOtpCode: t.procedure
        .input(sendOtpSchema)
        .mutation(async ({ input: { email } }) => {
            const { httpStatus, error, error_description } = await apiFetch<{
                error?: string;
                error_description?: string;
            }>(`${env.NEXT_PUBLIC_OAUTH_ISSUER_BASE_URL}/passwordless/start`, {
                method: 'POST',
                body: JSON.stringify({
                    client_id: env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
                    client_secret: env.OAUTH_CLIENT_SECRET,
                    connection: 'email',
                    email,
                    send: 'code',
                    authParams: {
                        scope: 'openid profile email'
                    }
                })
            });

            if (httpStatus !== 200) {
                throw new TRPCError({
                    message: `Une erreur est survenue, veuillez recommencer l'opération`,
                    code: 'BAD_REQUEST',
                    cause: `${error}: ${error_description}`
                });
            }

            return { success: true };
        }),

    verifyOtpCode: t.procedure
        .input(verifyOtpSchema)
        .mutation(async ({ ctx, input: { otp, email } }) => {
            // get access token
            const { access_token, error, error_description, httpStatus } =
                await apiFetch<Auth0TokenResult>(
                    `${env.NEXT_PUBLIC_OAUTH_ISSUER_BASE_URL}/oauth/token`,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            grant_type:
                                'http://auth0.com/oauth/grant-type/passwordless/otp',
                            client_id: env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
                            client_secret: env.OAUTH_CLIENT_SECRET,
                            otp,
                            realm: 'email',
                            username: email,
                            scope: 'openid profile email'
                        })
                    }
                );

            if (httpStatus !== 200) {
                let message = error_description;
                switch (error_description) {
                    case INVALID_CODE:
                        message = `Code de vérification invalide, veuillez saisir un code valide ou recommencer l'opération`;
                        break;
                    case EXPIRED_CODE:
                        message = `Ce code de vérification a expiré, veuillez recommencer l'opération`;
                        break;
                    case MAXIMUM_ATTEMPT:
                        message = `Vous avez atteint le nombre maximum de tentatives. Veuillez ressaisir votre email pour obtenir un nouveau code`;
                        break;
                }

                throw new TRPCError({
                    message,
                    code: 'UNAUTHORIZED',
                    cause: `${error}: ${error_description}`
                });
            }

            // get userinfos
            const userInfosResult = await apiFetch<Auth0UserInfoResult>(
                `${env.NEXT_PUBLIC_OAUTH_ISSUER_BASE_URL}/userinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }
            );

            if (userInfosResult.httpStatus !== 200) {
                throw new TRPCError({
                    message: `Code de vérification invalide, veuillez recommencer`,
                    code: 'UNAUTHORIZED',
                    cause: `${userInfosResult.error}: ${userInfosResult.error_description}`
                });
            }

            // get or create user
            const user = await ctx.prisma.user.upsert({
                where: {
                    email: email
                },
                create: {
                    email: userInfosResult.email,
                    avatarURL: userInfosResult.picture,
                    firstName: userInfosResult.given_name,
                    lastName: userInfosResult.family_name,
                    email_verified: true
                },
                update: {
                    firstName: userInfosResult.given_name,
                    lastName: userInfosResult.family_name
                }
            });

            // Set cookie to authenticate user
            // Stay connected for 30 days
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);

            const token = jwt.sign(
                {
                    id: new Uuid(user.id).short()
                },
                env.JWT_SECRET,
                {
                    expiresIn: `30d`, // 30 days
                    algorithm: 'HS256'
                }
            );

            ctx.res?.setHeader(
                'set-cookie',
                `__session=${token}; path=/; samesite=Lax; httponly; expires=${expirationDate.toUTCString()}`
            );

            return { success: true };
        }),
    removeAuthCookie: t.procedure.mutation(async ({ ctx }) => {
        ctx.res?.setHeader(
            'set-cookie',
            `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=Lax; httponly;`
        );
        return { success: true };
    }),

    verifyOAuthCode: t.procedure
        .input(
            z.object({
                code: z.string(),
                redirectTo: z.string().url()
            })
        )
        .mutation(async ({ ctx, input: { code, redirectTo } }) => {
            const oauthTokenQueryString = new URLSearchParams();
            oauthTokenQueryString.append(`grant_type`, `authorization_code`);
            oauthTokenQueryString.append(
                `client_id`,
                env.NEXT_PUBLIC_OAUTH_CLIENT_ID
            );
            oauthTokenQueryString.append(
                `client_secret`,
                env.OAUTH_CLIENT_SECRET
            );
            oauthTokenQueryString.append(`code`, code);
            oauthTokenQueryString.append(`redirect_uri`, redirectTo);

            console.log(oauthTokenQueryString.toString());

            // get access token
            const { access_token, error, error_description, httpStatus } =
                await apiFetch<Auth0TokenResult>(
                    `${env.NEXT_PUBLIC_OAUTH_ISSUER_BASE_URL}/oauth/token`,

                    {
                        method: 'POST',
                        body: oauthTokenQueryString.toString(),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );
            if (httpStatus !== 200) {
                throw new TRPCError({
                    message: `Une erreur est survenue lors de la connexion, veuillez vous reconnecter`,
                    code: 'UNAUTHORIZED',
                    cause: `${error}: ${error_description}`
                });
            }

            // get userinfos
            const userInfosResult = await apiFetch<Auth0UserInfoResult>(
                `${env.NEXT_PUBLIC_OAUTH_ISSUER_BASE_URL}/userinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }
            );

            console.dir({ userInfosResult }, { depth: null });

            if (userInfosResult.httpStatus !== 200) {
                throw new TRPCError({
                    message: `lien invalide, veuillez recommencer`,
                    code: 'UNAUTHORIZED',
                    cause: `${userInfosResult.error}: ${userInfosResult.error_description}`
                });
            }

            // get or create user
            const user = await ctx.prisma.user.upsert({
                where: {
                    email: userInfosResult.email
                },
                create: {
                    email: userInfosResult.email,
                    avatarURL: userInfosResult.picture,
                    firstName: userInfosResult.given_name,
                    lastName: userInfosResult.family_name,
                    email_verified: true
                },
                update: {
                    firstName: userInfosResult.given_name,
                    lastName: userInfosResult.family_name
                }
            });

            // Set cookie to authenticate user
            // Stay connected for 30 days
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);

            const token = jwt.sign(
                {
                    id: new Uuid(user.id).short()
                },
                env.JWT_SECRET,
                {
                    expiresIn: `30d`, // 30 days
                    algorithm: 'HS256'
                }
            );

            ctx.res?.setHeader(
                'set-cookie',
                `__session=${token}; path=/; samesite=Lax; httponly; expires=${expirationDate.toUTCString()}`
            );

            return {
                role: user.role
            };
        }),
    getAuthenticatedUser: protectedProcedure.query(({ ctx }) => {
        return ctx.user;
    }),
    getUser: t.procedure.query(({ ctx }) => {
        return ctx.user;
    })
});
