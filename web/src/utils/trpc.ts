// src/utils/trpc.ts
import type { AppRouter } from "../server/router";
import { createReactQueryHooks } from "@trpc/react";

export type tRPCHooksType = ReturnType<typeof createReactQueryHooks<AppRouter>>

export const trpc: tRPCHooksType = createReactQueryHooks<AppRouter>();

/**
 * Check out tRPC docs for Inference Helpers
 * https://trpc.io/docs/infer-types#inference-helpers
 */
