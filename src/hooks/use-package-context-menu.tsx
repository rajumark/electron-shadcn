import { useCallback } from "react";
import { ipc } from "@/ipc/manager";
import { packageStore } from "@/utils/store";
import { toast } from "sonner";

interface UsePackageContextMenuParams {
  selectedDevice: { id: string } | null;
  setPinnedPackages: (packages: string[]) => void;
  setRefreshKey: (updater: (prev: number) => number) => void;
  setError: (message: string) => void;
  setSearchQuery: (value: string) => void;
  onAppUninstalled?: (pkg: string) => void;
}

export function usePackageContextMenu({
  selectedDevice,
  setPinnedPackages,
  setRefreshKey,
  setError,
  setSearchQuery,
  onAppUninstalled,
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
        toast.success(
          isCurrentlyPinned
            ? `Unpinned ${pkg}`
            : `Pinned ${pkg}`,
        );
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
            toast.success(`Started ${pkg}`);
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
            toast.success(`Force stopped ${pkg}`);
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
            toast.success(`Restarted ${pkg}`);
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
            toast.success(`Cleared data for ${pkg}`);
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
            if (onAppUninstalled) {
              onAppUninstalled(pkg);
            }
            // Wait 1 extra second after uninstall completes before refreshing
            await new Promise(resolve => setTimeout(resolve, 3000));
            setRefreshKey((prev) => prev + 1);
            toast.success(`Uninstalled ${pkg}`);
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
            toast.success("Sent Home key event");
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
            toast.info(`Opened app info for ${pkg}`);
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
            toast.success(`Enabled ${pkg}`);
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
            toast.success(`Disabled ${pkg}`);
            break;
          }
          case "copy": {
            if (navigator?.clipboard) {
              await navigator.clipboard.writeText(pkg);
            }
            toast.success("Copied package name");
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
            toast.info(`Opening ${pkg} in Play Store app`);
            break;
          }
          case "open_in_playstore_site": {
            window.open(
              `https://play.google.com/store/apps/details?id=${pkg}`,
              "_blank",
            );
            toast.info("Opened Play Store page in browser");
            break;
          }
          case "find_apk_online": {
            const query = encodeURIComponent(`Download APK ${pkg}`);
            window.open(`https://www.google.com/search?q=${query}`, "_blank");
            break;
          }
          case "permissions": {
            setError("Permissions details view is not implemented in this app yet.");
            toast.info("Permissions view is not implemented yet.");
            break;
          }
          case "full_details": {
            setError("Full details view is not implemented in this app yet.");
            toast.info("Full details view is not implemented yet.");
            break;
          }
          default: {
            console.warn("Unhandled context menu action:", action);
          }
        }
      } catch (err) {
        console.error("Failed to perform ADB action:", err);
        const message =
          err instanceof Error ? err.message : "Unknown error";
        setError(
          `Failed to perform action "${action}" on ${pkg}: ${message}`,
        );
        toast.error(
          `Action "${action}" failed on ${pkg}: ${message}`,
        );
      }
    },
    [selectedDevice, setPinnedPackages, setRefreshKey, setError],
  );

  return { handleContextMenuAction };
}

