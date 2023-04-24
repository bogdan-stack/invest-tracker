import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const transactii = await ctx.prisma.post.findMany({
      take: 5,
      where: {userId: 'user_2NqTdK2ITSsjuQNBqD6cKbj1cLf'},
      orderBy: { investAt: 'desc' },
    });
    return transactii;
  }),
  getSumSim: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.groupBy({
      by: ['fondName'],
        where: {
          fondName: 'BRD Simfonia',
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
});
