import { os } from "@orpc/server";
import { z } from "zod";
import { ADBHelper } from "@/utils/adb-helper";

export const checkADB = os.handler(async () => {
  return await ADBHelper.checkADBReady();
});

export const downloadADB = os.handler(async () => {
  return await ADBHelper.downloadADB();
});

export const executeADBCommand = os
  .input(
    z.object({
      args: z.array(z.string()),
    })
  )
  .handler(async ({ input }) => {
    return await ADBHelper.executeADBCommand(input.args);
  });

export const getADBPath = os.handler(() => {
  return ADBHelper.getADBPath();
});

export const adb = {
  checkADB,
  downloadADB,
  executeADBCommand,
  getADBPath,
};
