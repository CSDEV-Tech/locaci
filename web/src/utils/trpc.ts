// src/utils/trpc.ts
import type { AppRouter } from "../server/router";
import { createReactQueryHooks } from "@trpc/react";
import type { inferProcedureOutput, inferProcedureInput } from "@trpc/server";


export type tRPCHooksType = ReturnType<typeof createReactQueryHooks<AppRouter>>;

export const trpc: tRPCHooksType = createReactQueryHooks<AppRouter>();

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<
  TRouteKey extends keyof AppRouter["_def"]["queries"],
> = inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>;

export type inferQueryInput<
  TRouteKey extends keyof AppRouter["_def"]["queries"],
> = inferProcedureInput<AppRouter["_def"]["queries"][TRouteKey]>;

export type inferMutationOutput<
  TRouteKey extends keyof AppRouter["_def"]["mutations"],
> = inferProcedureOutput<AppRouter["_def"]["mutations"][TRouteKey]>;

export type inferMutationInput<
  TRouteKey extends keyof AppRouter["_def"]["mutations"],
> = inferProcedureInput<AppRouter["_def"]["mutations"][TRouteKey]>;


export async function createSSGHelpers() {
  const { createSSGHelpers } = await import('@trpc/react/ssg');
  const { appRouter } = await import('../server/router');
  const superjson = await import('superjson');
  const { createContext } = await import('../server/router/context');

  const ssg = await createSSGHelpers({
      router: appRouter,
      ctx: await createContext(),
      transformer: superjson
  });

  return ssg;
} 