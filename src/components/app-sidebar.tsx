import {
  AlignLeft,
  Bell,
  Bone,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDot,
  Grid3x3,
  Layers,
  Layout,
  List,
  Maximize2,
  Menu,
  Minus,
  MoreHorizontal,
  MousePointer,
  Move,
  Navigation,
  Package,
  Palette,
  PanelLeft,
  Plus,
  Pointer,
  RectangleHorizontal,
  RotateCw,
  Search,
  Sliders,
  Square,
  Table,
  Tag,
  Terminal,
  ToggleLeft,
  TrendingUp,
  Type,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const components = [
  { name: "Accordion", icon: ChevronDown, path: "#accordion" },
  { name: "Alert", icon: Bell, path: "#alert" },
  { name: "Alert Dialog", icon: Bell, path: "#alert-dialog" },
  { name: "Aspect Ratio", icon: RectangleHorizontal, path: "#aspect-ratio" },
  { name: "Avatar", icon: User, path: "#avatar" },
  { name: "Badge", icon: Tag, path: "#badge" },
  { name: "Breadcrumb", icon: ChevronRight, path: "#breadcrumb" },
  { name: "Button", icon: Pointer, path: "#button" },
  { name: "Button Group", icon: Plus, path: "#button-group" },
  { name: "Calendar", icon: Calendar, path: "#calendar" },
  { name: "Card", icon: RectangleHorizontal, path: "#card" },
  { name: "Carousel", icon: Layers, path: "#carousel" },
  { name: "Chart", icon: TrendingUp, path: "#chart" },
  { name: "Checkbox", icon: CheckSquare, path: "#checkbox" },
  { name: "Collapsible", icon: ChevronDown, path: "#collapsible" },
  { name: "Combobox", icon: Search, path: "#combobox" },
  { name: "Command", icon: Terminal, path: "#command" },
  { name: "Context Menu", icon: MoreHorizontal, path: "#context-menu" },
  { name: "Dialog", icon: Square, path: "#dialog" },
  { name: "Dropdown Menu", icon: ChevronDown, path: "#dropdown-menu" },
  { name: "Drawer", icon: PanelLeft, path: "#drawer" },
  { name: "Empty", icon: Package, path: "#empty" },
  { name: "Field", icon: Type, path: "#field" },
  { name: "Hover Card", icon: MousePointer, path: "#hover-card" },
  { name: "Input", icon: Type, path: "#input" },
  { name: "Input Group", icon: Grid3x3, path: "#input-group" },
  { name: "Input OTP", icon: Type, path: "#input-otp" },
  { name: "Item", icon: Package, path: "#item" },
  { name: "KBD", icon: Type, path: "#kbd" },
  { name: "Label", icon: Type, path: "#label" },
  { name: "Menubar", icon: Menu, path: "#menubar" },
  { name: "Navigation Menu", icon: Navigation, path: "#navigation-menu" },
  { name: "Native Select", icon: List, path: "#native-select" },
  { name: "Pagination", icon: MoreHorizontal, path: "#pagination" },
  { name: "Popover", icon: Circle, path: "#popover" },
  { name: "Progress", icon: TrendingUp, path: "#progress" },
  { name: "Radio Group", icon: CircleDot, path: "#radio-group" },
  { name: "Resizable", icon: Move, path: "#resizable" },
  { name: "Scroll Area", icon: Maximize2, path: "#scroll-area" },
  { name: "Select", icon: List, path: "#select" },
  { name: "Separator", icon: Minus, path: "#separator" },
  { name: "Sheet", icon: PanelLeft, path: "#sheet" },
  { name: "Sidebar", icon: PanelLeft, path: "#sidebar" },
  { name: "Skeleton", icon: Bone, path: "#skeleton" },
  { name: "Slider", icon: Sliders, path: "#slider" },
  { name: "Sonner", icon: Bell, path: "#sonner" },
  { name: "Spinner", icon: RotateCw, path: "#spinner" },
  { name: "Switch", icon: ToggleLeft, path: "#switch" },
  { name: "Table", icon: Table, path: "#table" },
  { name: "Tabs", icon: Layout, path: "#tabs" },
  { name: "Textarea", icon: AlignLeft, path: "#textarea" },
  { name: "Toggle", icon: ToggleLeft, path: "#toggle" },
  { name: "Toggle Group", icon: Grid3x3, path: "#toggle-group" },
  { name: "Tooltip", icon: MousePointer, path: "#tooltip" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuButton
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          size="lg"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Palette className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">UI Demo</span>
            <span className="truncate text-xs">Components</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {components.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.path}>
                      <item.icon className="size-4" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Navigation className="size-4" />
              <span>Navigation</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
