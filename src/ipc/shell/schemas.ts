import z from "zod";

export const openExternalLinkInputSchema = z.object({
  url: z.url(),
});

export const openTerminalInputSchema = z.object({
  path: z.string(),
});
