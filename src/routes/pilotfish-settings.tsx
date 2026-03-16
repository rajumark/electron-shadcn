import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun, Monitor, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentTheme, setTheme, toggleTheme } from "@/actions/theme";
import { updateAppLanguage } from "@/actions/language";
import type { ThemeMode } from "@/types/theme-mode";

function PilotfishSettingsPage() {
  const { t, i18n } = useTranslation();
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await getCurrentTheme();
        setCurrentTheme(theme.local || "system");
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };
    loadTheme();
  }, []);

  const handleThemeChange = async (newTheme: ThemeMode) => {
    setIsLoading(true);
    try {
      await setTheme(newTheme);
      setCurrentTheme(newTheme);
      toast.success(`Theme changed to ${newTheme}`);
    } catch (error) {
      console.error("Failed to change theme:", error);
      toast.error("Failed to change theme");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickToggle = async () => {
    setIsLoading(true);
    try {
      await toggleTheme();
      const theme = await getCurrentTheme();
      setCurrentTheme(theme.local || "system");
      toast.success("Theme toggled");
    } catch (error) {
      console.error("Failed to toggle theme:", error);
      toast.error("Failed to toggle theme");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    updateAppLanguage(i18n);
    toast.success(`Language changed to ${language}`);
  };

  const getThemeIcon = (theme: ThemeMode) => {
    switch (theme) {
      case "dark":
        return Moon;
      case "light":
        return Sun;
      case "system":
        return Monitor;
      default:
        return Monitor;
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Pilotfish Settings</h1>
        <p className="text-muted-foreground">
          Customize your application preferences and appearance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Theme Settings
            </CardTitle>
            <CardDescription>
              Choose your preferred color scheme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Theme Mode</Label>
              <RadioGroup
                value={currentTheme}
                onValueChange={(value) => handleThemeChange(value as ThemeMode)}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    System
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleQuickToggle}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {(() => {
                  const Icon = getThemeIcon(currentTheme);
                  return <Icon className="mr-2 h-4 w-4" />;
                })()}
                Quick Toggle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language Settings
            </CardTitle>
            <CardDescription>
              Select your preferred language
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={i18n.language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Current language: <strong>{i18n.language}</strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings Info */}
      <Card>
        <CardHeader>
          <CardTitle>About Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Theme changes are applied immediately and saved automatically</p>
            <p>• Language changes affect the entire application interface</p>
            <p>• System theme follows your operating system's preference</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/pilotfish-settings")({
  component: PilotfishSettingsPage,
});
