import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .query(async({ ctx }) => {
      return{
        greeting: `Hello, ${ ctx.user?.firstName}!`,
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const transactii = await ctx.prisma.post.findMany({
      where: {userId: ctx.userId!},
      orderBy: { investAt: 'desc' },
    });
    return transactii;
  }),
  getSumSim: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.groupBy({
      by: ['fondName'],
        where: {
          fondName: 'BRD Simfonia',
          userId: ctx.userId!,
        },
        _sum: {
          investAmount: true,
          nrUf: true
        }
    });
  }),
  getSumAct: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.groupBy({
      by: ['fondName'],
        where: {
          fondName: 'BRD Actiuni',
          userId: ctx.userId!,
        },
        _sum: {
          investAmount: true,
          nrUf: true
        }
    });
  }),
  create: privateProcedure.input(z.object({
    fondName: z.string(),
    investAmount: z.number(),
    nrUf: z.number(),
    ufValue: z.number(),
  })).mutation(async ({ctx, input}) => {
    const userId = ctx.userId!;

    const post = await ctx.prisma.post.create({
      data: {
        userId,
        fondName: input.fondName,
        investAmount: input.investAmount,
        nrUf: parseFloat(input.nrUf.toFixed(4)),
        ufValue: parseFloat(input.ufValue.toFixed(4)),
      },
  });
}),
delete: privateProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
  await ctx.prisma.post.delete({
    where: {
      id: input,
    },
  });
}),
});
