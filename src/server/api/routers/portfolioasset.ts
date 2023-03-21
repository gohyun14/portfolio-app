import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const portfolioAssetRouter = createTRPCRouter({
  createAsset: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        assetSymbol: z.string(),
        assetName: z.string(),
        amount: z.number(),
        type: z.enum(["STOCK", "CRYPTO"]),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.portfolioAsset.create({
        data: {
          userId: input.userId,
          assetSymbol: input.assetSymbol,
          assetName: input.assetName,
          amount: input.amount,
          type: input.type,
          AssetTransaction: {
            create: {
              type: "INITIAL",
              assetSymbol: input.assetSymbol,
              amount: input.amount,
              userId: input.userId,
            },
          },
        },
      });
    }),
  getAllAssetsByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.portfolioAsset.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: {
          assetSymbol: "asc",
        },
      });
    }),
  deleteAssetById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.portfolioAsset.delete({
        where: {
          id: input.id,
        },
      });
    }),
  updateAssetAmountById: protectedProcedure
    .input(z.object({ assetId: z.string(), amount: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.portfolioAsset.update({
        where: {
          id: input.assetId,
        },
        data: {
          amount: input.amount,
        },
      });
    }),
});
