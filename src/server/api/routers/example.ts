import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure.query(async ({ ctx }) => {
    return {
      greeting: `Hello, ${ctx.user?.firstName}!`,
    };
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const transactii = await ctx.prisma.post.findMany({
      where: { userId: ctx.userId! },
      orderBy: { investAt: "desc" },
    });
    return transactii;
  }),
  getSumSim: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.groupBy({
      by: ["fondName"],
      where: {
        fondName: "BRD Simfonia",
        userId: ctx.userId!,
      },
      _sum: {
        investAmount: true,
        nrUf: true,
      },
    });
  }),
  getSumAct: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.groupBy({
      by: ["fondName"],
      where: {
        fondName: "BRD Actiuni",
        userId: ctx.userId!,
      },
      _sum: {
        investAmount: true,
        nrUf: true,
      },
    });
  }),
  getIncomeMonthly: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.budget.groupBy({
      by: ["transactionType"],
      where: {
        transactionType: "Income",
        userId: ctx.userId!,
        transactionMonth: "May",
      },
      _sum: {
        transactionAmount: true,
      },
    });
  }),
  getAllExpenses: publicProcedure.query(async ({ ctx }) => {
    const transactii = await ctx.prisma.budget.findMany({
      where: { userId: ctx.userId!, transactionType: "Expense" },
      orderBy: { transactionAt: "desc" },
    });
    return transactii;
  }),
  getExpenseMonthly: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.budget.groupBy({
      by: ["transactionType"],
      where: {
        transactionType: "Expense",
        userId: ctx.userId!,
        transactionMonth: "May",
      },
      _sum: {
        transactionAmount: true,
      },
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        fondName: z.string(),
        investAmount: z.number(),
        investAt: z.date(),
        nrUf: z.number(),
        ufValue: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!;

      const post = await ctx.prisma.post.create({
        data: {
          userId,
          firstName: ctx.user?.firstName?.toString(),
          fondName: input.fondName,
          investAmount: input.investAmount,
          investAt: input.investAt,
          nrUf: parseFloat(input.nrUf.toFixed(4)),
          ufValue: parseFloat(input.ufValue.toFixed(4)),
        },
      });
    }),

    createExpenses: privateProcedure
    .input(
      z.object({
        transactionName: z.string(),
      transactionAmount: z.number(),
      transactionTag: z.string(),
      transactionMonth: z.string(),
      transactionType: z.string(),
      transactionAt: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!;

      const post = await ctx.prisma.budget.create({
        data: {
          userId,
          transactionName: input.transactionName,
        transactionAmount: input.transactionAmount,
        transactionTag: input.transactionTag,
        transactionMonth: input.transactionMonth,
        transactionType: input.transactionType,
        transactionAt: input.transactionAt,

        },
      });
    }),

  delete: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.post.delete({
        where: {
          id: input,
        },
      });
    }),
});
