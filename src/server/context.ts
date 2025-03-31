import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createContext = (_opts: CreateNextContextOptions) => ({});
export type Context = inferAsyncReturnType<typeof createContext>;
