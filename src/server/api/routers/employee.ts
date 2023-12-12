import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fakerEN_IN as faker } from "@faker-js/faker";

export const employeeRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.employee.findMany({
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    });
  }),

  faker: publicProcedure.mutation(async ({ ctx }) => {
    const name = faker.person.firstName();
    const employee = await ctx.db.employee.create({
      data: {
        name: name,
        email: faker.internet
          .email({
            firstName: name,
            provider: "gmail.com",
          })
          .toLowerCase(),
        department: faker.person.jobTitle(),
        mobile: faker.string.numeric({ length: 10, exclude: ["0"] }),
      },
    });

    return employee;
  }),

  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        email: z.string().email(),
        department: z.string().min(1),
        mobile: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.employee.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          department: input.department,
          mobile: input.mobile,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        department: z.string().min(1),
        mobile: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.employee.create({
        data: {
          name: input.name,
          email: input.email,
          department: input.department,
          mobile: input.mobile,
        },
      });
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.employee.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.employee.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
