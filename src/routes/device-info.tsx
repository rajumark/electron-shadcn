import { createFileRoute } from "@tanstack/react-router";
import DeviceInfo from "@/components/device-info/DeviceInfo";

function DeviceInfoPage() {
  return <DeviceInfo />;
}

export const Route = createFileRoute("/device-info")({
  component: DeviceInfoPage,
});
