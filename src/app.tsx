import { RouterProvider } from "@tanstack/react-router";
import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";
import { updateAppLanguage } from "./actions/language";
import { syncWithLocalTheme } from "./actions/theme";
import { ADBSetupDialog } from "./components/adb-setup-dialog";
import { Toaster } from "./components/ui/sonner";
import { ipc } from "./ipc/manager";
import { router } from "./utils/routes";
import "./localization/i18n";

export default function App() {
  const { i18n } = useTranslation();
  const [showADBDialog, setShowADBDialog] = useState(false);
  const [adbChecked, setAdbChecked] = useState(false);

  const checkADBStatus = useCallback(async () => {
    try {
      const isADBReady = await ipc.client.adb.checkADB();
      if (!isADBReady) {
        setShowADBDialog(true);
      }
      setAdbChecked(true);
    } catch (error) {
      console.error("Failed to check ADB status:", error);
      setAdbChecked(true);
    }
  }, []);

  useEffect(() => {
    syncWithLocalTheme();
    updateAppLanguage(i18n);

    // Check ADB status on app launch
    if (!adbChecked) {
      checkADBStatus();
    }
  }, [i18n, adbChecked, checkADBStatus]);

  const handleSetupComplete = () => {
    setAdbChecked(true);
  };

  return (
    <>
      <RouterProvider router={router} />
      <ADBSetupDialog
        isOpen={showADBDialog}
        onClose={() => setShowADBDialog(false)}
        onSetupComplete={handleSetupComplete}
      />
      <Toaster />
    </>
  );
}

const container = document.getElementById("app");
if (!container) {
  throw new Error('Root element with id "app" not found');
}
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
