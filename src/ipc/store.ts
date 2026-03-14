import { os } from "@orpc/server";
import { z } from "zod";
import Store from 'electron-store';

interface StoreSchema {
  pinnedPackages: string[];
}

const store = new Store<StoreSchema>({
  defaults: {
    pinnedPackages: []
  }
});

export const getPinnedPackages = os.handler(async () => {
  return store.get('pinnedPackages', []);
});

export const pinPackage = os
  .input(z.object({ packageName: z.string() }))
  .handler(async ({ input }) => {
    const pinned = store.get('pinnedPackages', []);
    if (!pinned.includes(input.packageName)) {
      store.set('pinnedPackages', [...pinned, input.packageName]);
    }
    return store.get('pinnedPackages', []);
  });

export const unpinPackage = os
  .input(z.object({ packageName: z.string() }))
  .handler(async ({ input }) => {
    const pinned = store.get('pinnedPackages', []);
    const updated = pinned.filter(pkg => pkg !== input.packageName);
    store.set('pinnedPackages', updated);
    return updated;
  });

export const isPinned = os
  .input(z.object({ packageName: z.string() }))
  .handler(async ({ input }) => {
    const pinned = store.get('pinnedPackages', []);
    return pinned.includes(input.packageName);
  });

export const clearAllPinned = os.handler(async () => {
  store.set('pinnedPackages', []);
  return [];
});

export const storeHandlers = {
  getPinnedPackages,
  pinPackage,
  unpinPackage,
  isPinned,
  clearAllPinned,
};
