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

  getAllMonths: publicProcedure.query(async ({ ctx }) => {
    const uniqueMonths = await ctx.prisma.budget.findMany({
      select: {
        transactionMonth: true,
      },
      distinct: ["transactionMonth"],
      where: { userId: ctx.userId! },
      orderBy: { transactionMonth: "asc" },
    });
    return uniqueMonths.map((entry) => entry.transactionMonth);
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
  getIncomeMonthly: privateProcedure
  .input(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { startDate, endDate } = input;
    return ctx.prisma.budget.groupBy({
      by: ["transactionType"],
      where: {
        userId: ctx.userId!,
        transactionType: "Income",
        transactionAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        transactionAmount:true,
      }
    });
  }),

  getNeedsMonthly: privateProcedure
  .input(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { startDate, endDate } = input;
    return ctx.prisma.budget.groupBy({
      by: ["transactionType"],
      where: {
        userId: ctx.userId!,
        transactionType: "Expense",
        transactionTag: "Needs",
        transactionAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        transactionAmount:true,
      }
    });
  }),

  getWantsMonthly: privateProcedure
  .input(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { startDate, endDate } = input;
    return ctx.prisma.budget.groupBy({
      by: ["transactionType"],
      where: {
        userId: ctx.userId!,
        transactionType: "Expense",
        transactionTag: "Wants",
        transactionAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        transactionAmount:true,
      }
    });
  }),
  getSavingsMonthly: privateProcedure
  .input(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { startDate, endDate } = input;
    return ctx.prisma.budget.groupBy({
      by: ["transactionType"],
      where: {
        userId: ctx.userId!,
        transactionType: "Expense",
        transactionTag: "Savings",
        transactionAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        transactionAmount:true,
      }
    });
  }),
  getExpenseMonthly: privateProcedure
  .input(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { startDate, endDate } = input;
    return ctx.prisma.budget.groupBy({
      by: ["transactionType"],
      where: {
        userId: ctx.userId!,
        transactionType: "Expense",
        transactionAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        transactionAmount:true,
      }
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

    getAllIncome: privateProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = input;
      const transactii = await ctx.prisma.budget.findMany({
        where: {
          userId: ctx.userId!,
          transactionType: "Income",
          transactionAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { transactionAt: "desc" },
      });
      return transactii;
    }),

    getAllExpenses: privateProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = input;
      const transactii = await ctx.prisma.budget.findMany({
        where: {
          userId: ctx.userId!,
          transactionType: "Expense",
          transactionAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { transactionAt: "desc" },
      });
      return transactii;
    }),

  createTransactions: privateProcedure
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
  
  deleteExpense: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.budget.delete({
        where: {
          transactionId: input,
        },
      });
    }),
});
