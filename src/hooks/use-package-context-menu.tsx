import { useCallback } from "react";
import { ipc } from "@/ipc/manager";
import { packageStore } from "@/utils/store";

interface UsePackageContextMenuParams {
  selectedDevice: { id: string } | null;
  setPinnedPackages: (packages: string[]) => void;
  setRefreshKey: (updater: (prev: number) => number) => void;
  setError: (message: string) => void;
  setSearchQuery: (value: string) => void;
}

export function usePackageContextMenu({
  selectedDevice,
  setPinnedPackages,
  setRefreshKey,
  setError,
  setSearchQuery,
}: UsePackageContextMenuParams) {
  const handleContextMenuAction = useCallback(
    async (action: string, pkg: string) => {
      console.log(`Action: ${action}, Package: ${pkg}`);

      if (action === "pin_app") {
        const isCurrentlyPinned = await packageStore.isPinned(pkg);
        if (isCurrentlyPinned) {
          await packageStore.unpinPackage(pkg);
        } else {
          await packageStore.pinPackage(pkg);
        }
        const updatedPinned = await packageStore.getPinnedPackages();
        setPinnedPackages(updatedPinned);
        setRefreshKey((prev) => prev + 1);
        return;
      }

      if (action === "search_here") {
        setSearchQuery(pkg);
        return;
      }

      if (!selectedDevice) {
        console.warn("No device selected for ADB action");
        return;
      }

      try {
        switch (action) {
          case "start": {
            await ipc.client.adb.executeADBCommand({
              args: [
                "-s",
                selectedDevice.id,
                "shell",
                "monkey",
                "-p",
                pkg,
                "-c",
                "android.intent.category.LAUNCHER",
                "1",
              ],
              useCache: false,
            });
            break;
          }
          case "force_stop": {
            await ipc.client.adb.executeADBCommand({
              args: [
                "-s",
                selectedDevice.id,
                "shell",
                "am",
                "force-stop",
                pkg,
              ],
              useCache: false,
            });
            break;
          }
          case "restart": {
            await ipc.client.adb.executeADBCommand({
              args: [
                "-s",
                selectedDevice.id,
                "shell",
                "am",
                "force-stop",
                pkg,
              ],
              useCache: false,
            });
            await ipc.client.adb.executeADBCommand({
              args: [
                "-s",
                selectedDevice.id,
                "shell",
                "monkey",
                "-p",
                pkg,
                "-c",
                "android.intent.category.LAUNCHER",
                "1",
              ],
              useCache: false,
            });
            break;
          }
          case "clear_data": {
            const confirmed = window.confirm(
              `Clear data for "${pkg}"?\n\nThis will erase the app's data and reset it as if it was just installed.`,
            );
            if (!confirmed) {
              break;
            }

            await ipc.client.adb.executeADBCommand({
              args: [
                "-s",
                selectedDevice.id,
                "shell",
                "pm",
                "clear",
                pkg,
              ],
              useCache: false,
            });
            break;
          }
          case "uninstall": {
            const confirmed = window.confirm(
              `Uninstall "${pkg}" from the selected device?\n\nThe app and its data will be removed.`,
            );
            if (!confirmed) {
              break;
            }

            await ipc.client.adb.executeADBCommand({
              args: [
                "-s",
                selectedDevice.id,
                "shell",
                "pm",
                "uninstall",
                pkg,
              ],
              useCache: false,
            });
            setRefreshKey((prev) => prev + 1);
            break;
          }
          case "home": {
            await ipc.client.adb.executeADBCommand({
              args: [
                "-s",
                selectedDevice.id,
                "shell",
                "input",
                "keyevent",
                "3",
              ],
              useCache: false,
            });
            break;
          }
          case "app_info": {
            await ipc.client.adb.executeADBCommand({
              args: [
                "-s",
                selectedDevice.id,
                "shell",
                "am",
                "start",
                "-a",
                "android.settings.APPLICATION_DETAILS_SETTINGS",
                "-d",
                `package:${pkg}`,
              ],
              useCache: false,
            });
            break;
          }
          case "enable": {
            await ipc.client.adb.executeADBCommand({
              args: [
                "-s",
                selectedDevice.id,
                "shell",
                "pm",
                "enable",
                pkg,
              ],
              useCache: false,
            });
            break;
          }
          case "disable": {
            await ipc.client.adb.executeADBCommand({
              args: [
                "-s",
                selectedDevice.id,
                "shell",
                "pm",
                "disable-user",
                pkg,
              ],
              useCache: false,
            });
            break;
          }
          case "copy": {
            if (navigator?.clipboard) {
              await navigator.clipboard.writeText(pkg);
            }
            break;
          }
          case "open_in_playstore_app": {
            await ipc.client.adb.executeADBCommand({
              args: [
                "-s",
                selectedDevice.id,
                "shell",
                "am",
                "start",
                "-a",
                "android.intent.action.VIEW",
                "-d",
                `market://details?id=${pkg}`,
              ],
              useCache: false,
            });
            break;
          }
          case "open_in_playstore_site": {
            window.open(
              `https://play.google.com/store/apps/details?id=${pkg}`,
              "_blank",
            );
            break;
          }
          case "find_apk_online": {
            const query = encodeURIComponent(`Download APK ${pkg}`);
            window.open(`https://www.google.com/search?q=${query}`, "_blank");
            break;
          }
          case "permissions": {
            setError("Permissions details view is not implemented in this app yet.");
            break;
          }
          case "full_details": {
            setError("Full details view is not implemented in this app yet.");
            break;
          }
          default: {
            console.warn("Unhandled context menu action:", action);
          }
        }
      } catch (err) {
        console.error("Failed to perform ADB action:", err);
        setError(
          `Failed to perform action "${action}" on ${pkg}: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
        );
      }
    },
    [selectedDevice, setPinnedPackages, setRefreshKey, setError],
  );

  return { handleContextMenuAction };
}

