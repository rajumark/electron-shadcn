import { ipc } from "@/ipc/manager";

export const packageStore = {
  async getPinnedPackages(): Promise<string[]> {
    return await ipc.client.store.getPinnedPackages();
  },

  async pinPackage(packageName: string): Promise<string[]> {
    return await ipc.client.store.pinPackage({ packageName });
  },

  async unpinPackage(packageName: string): Promise<string[]> {
    return await ipc.client.store.unpinPackage({ packageName });
  },

  async isPinned(packageName: string): Promise<boolean> {
    return await ipc.client.store.isPinned({ packageName });
  },

  async clearAllPinned(): Promise<string[]> {
    return await ipc.client.store.clearAllPinned();
  }
};
