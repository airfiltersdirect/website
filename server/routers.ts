import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sendOrderEmail } from "./email";
import { z } from "zod";

const orderItemSchema = z.object({
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  packageNote: z.string().optional(),
});

const sendOrderEmailInput = z.object({
  orderId: z.string(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  postalCode: z.string(),
  payment: z.enum(['etransfer', 'card_cash']),
  items: z.array(orderItemSchema),
  subtotal: z.number(),
  hst: z.number(),
  total: z.number(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  orders: router({
    sendEmail: publicProcedure
      .input(sendOrderEmailInput)
      .mutation(async ({ input }) => {
        try {
          await sendOrderEmail(input);
          return { success: true };
        } catch (err) {
          console.error('[Email] Failed to send order email:', err);
          // Return success:false but don't throw — order is already placed
          return { success: false, error: String(err) };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
