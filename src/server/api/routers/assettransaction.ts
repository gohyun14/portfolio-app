import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const assetTransactionRouter = createTRPCRouter({
  createTransaction: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        portfolioAssetId: z.string(),
        symbol: z.string(),
        amount: z.number(),
        type: z.enum(["INITIAL", "BUY", "SELL"]),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.assetTransaction.create({
        data: {
          userId: input.userId,
          assetSymbol: input.symbol,
          amount: input.amount,
          type: input.type,
          portfolioAssetId: input.portfolioAssetId,
        },
      });
    }),
  getAllTransactionsByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.assetTransaction.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: {
          date: "desc",
        },
      });
    }),
  deleteTransactionById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.assetTransaction.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
