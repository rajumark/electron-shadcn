import { Moon } from "lucide-react";
import { toggleTheme } from "@/actions/theme";
import { Button } from "@/components/ui/button";

export default function ToggleTheme() {
  return (
    <Button onClick={toggleTheme} size="icon">
      <Moon size={16} className="text-foreground hover:text-primary transition-colors" />
    </Button>
  );
}
