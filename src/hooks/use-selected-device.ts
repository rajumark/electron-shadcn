import { create } from "zustand";

interface Device {
  id: string;
  name: string;
}

interface DeviceStore {
  selectedDevice: Device | null;
  setSelectedDevice: (Device: Device | null) => void;
}

export const useSelectedDevice = create<DeviceStore>((set) => ({
  selectedDevice: null,
  setSelectedDevice: (Device) => set({ selectedDevice: Device }),
}));
