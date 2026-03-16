import { adb } from "./adb";
import { app } from "./app";
import { shell } from "./shell";
import { storeHandlers } from "./store";
import { theme } from "./theme";
import { window } from "./window";

export const router = {
  theme,
  window,
  app,
  shell,
  adb,
  store: storeHandlers,
};
