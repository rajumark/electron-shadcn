import { os } from "@orpc/server";
import { exec } from "child_process";
import { shell } from "electron";
import { platform } from "os";
import {
  openExternalLinkInputSchema,
  openTerminalInputSchema,
} from "./schemas";

export const openExternalLink = os
  .input(openExternalLinkInputSchema)
  .handler(({ input }) => {
    const { url } = input;
    shell.openExternal(url);
  });

export const openTerminal = os
  .input(openTerminalInputSchema)
  .handler(({ input }) => {
    const { path } = input;
    const platformName = platform();

    let command: string;

    switch (platformName) {
      case "win32":
        // Windows: Open Command Prompt
        command = `cd /d "${path}" && start cmd`;
        break;
      case "darwin":
        // macOS: Open Terminal
        command = `osascript -e 'tell application "Terminal" to do script "cd ${path.replace(/"/g, '\\"')}"'`;
        break;
      case "linux":
        // Linux: Try common terminal emulators
        command = `cd "${path}" && (gnome-terminal || xterm || konsole || x-terminal-emulator)`;
        break;
      default:
        throw new Error(`Unsupported platform: ${platformName}`);
    }

    exec(command, (error) => {
      if (error) {
        console.error("Failed to open terminal:", error);
      }
    });
  });
