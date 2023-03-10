import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { userRouter } from "./routers/user";
import { portfolioAssetRouter } from "./routers/portfolioasset";
import { assetTransactionRouter } from "./routers/assettransaction";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  portfolioAsset: portfolioAssetRouter,
  assetTransaction: assetTransactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
