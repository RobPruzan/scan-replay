import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { sessionReplay } from "~/server/db/schema";

export const replayRouter = createTRPCRouter({
  getReplays: publicProcedure.query(async ({ input }) => {
    const data = await db.select().from(sessionReplay);
    return data;
  }),
  getReplayById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const replay = await db
        .select()
        .from(sessionReplay)
        .where(eq(sessionReplay.id, input.id))
        .then((data) => data.at(0));
      if (!replay) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "no replay",
        });
      }
      return replay;
    }),
  upload: publicProcedure
    .input(
      z.object({
        events: z.array(z.any()),
      }),
    )
    .mutation(async ({ input }) => {
      await db.insert(sessionReplay).values({
        events: input.events,
      });
    }),
});
