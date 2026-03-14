import { adb } from "./adb";
import { app } from "./app";
import { shell } from "./shell";
import { theme } from "./theme";
import { window } from "./window";
import { storeHandlers } from "./store";

export const router = {
  theme,
  window,
  app,
  shell,
  adb,
  store: storeHandlers,
};
