import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty } from "@/components/ui/empty";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function UIDemoPage() {
  const { t } = useTranslation();

  return (
    <TooltipProvider>
      <div className="mb-2 flex h-[calc(100vh-8rem)]">
        <div className="relative flex flex-1">
          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="mb-6 flex items-center gap-2">
              <h1 className="font-bold text-2xl">UI Demo</h1>
              <Badge variant="secondary">Coming soon</Badge>
            </div>

            <div className="space-y-8">
              {/* Badge Section */}
              <section className="space-y-4" id="badge">
                <h2 className="font-semibold text-xl">Badge</h2>
                <div className="flex gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </section>

              {/* Button Section */}
              <section className="space-y-4" id="button">
                <h2 className="font-semibold text-xl">Button</h2>
                <div className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </section>

              {/* Card Section */}
              <section className="space-y-4" id="card">
                <h2 className="font-semibold text-xl">Card</h2>
                <Card className="w-96">
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Card content goes here. This is a demo card.</p>
                  </CardContent>
                  <CardFooter>
                    <Button>Card Action</Button>
                  </CardFooter>
                </Card>
              </section>

              {/* Input Section */}
              <section className="space-y-4" id="input">
                <h2 className="font-semibold text-xl">Input</h2>
                <div className="max-w-md space-y-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                    />
                  </div>
                </div>
              </section>

              {/* Select Section */}
              <section className="space-y-4" id="select">
                <h2 className="font-semibold text-xl">Select</h2>
                <div className="max-w-md">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </section>

              {/* Switch Section */}
              <section className="space-y-4" id="switch">
                <h2 className="font-semibold text-xl">Switch</h2>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
              </section>

              {/* Textarea Section */}
              <section className="space-y-4" id="textarea">
                <h2 className="font-semibold text-xl">Textarea</h2>
                <div className="max-w-md">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here."
                  />
                </div>
              </section>

              {/* Tabs Section */}
              <section className="space-y-4" id="tabs">
                <h2 className="font-semibold text-xl">Tabs</h2>
                <Tabs className="w-96" defaultValue="account">
                  <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account">
                    <p>Account content goes here.</p>
                  </TabsContent>
                  <TabsContent value="password">
                    <p>Password content goes here.</p>
                  </TabsContent>
                </Tabs>
              </section>

              {/* Accordion Section */}
              <section className="space-y-4" id="accordion">
                <h2 className="font-semibold text-xl">Accordion</h2>
                <Accordion className="w-96" collapsible type="single">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It comes with default styles.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              {/* Alert Section */}
              <section className="space-y-4" id="alert">
                <h2 className="font-semibold text-xl">Alert</h2>
                <div className="max-w-md space-y-2">
                  <Alert>
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                      This is an information alert.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>This is an error alert.</AlertDescription>
                  </Alert>
                </div>
              </section>

              {/* Avatar Section */}
              <section className="space-y-4" id="avatar">
                <h2 className="font-semibold text-xl">Avatar</h2>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage
                      alt="@shadcn"
                      src="https://github.com/shadcn.png"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </div>
              </section>

              {/* Checkbox Section */}
              <section className="space-y-4" id="checkbox">
                <h2 className="font-semibold text-xl">Checkbox</h2>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
              </section>

              {/* Radio Group Section */}
              <section className="space-y-4" id="radio-group">
                <h2 className="font-semibold text-xl">Radio Group</h2>
                <RadioGroup defaultValue="option-one">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="option-one" value="option-one" />
                    <Label htmlFor="option-one">Option One</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="option-two" value="option-two" />
                    <Label htmlFor="option-two">Option Two</Label>
                  </div>
                </RadioGroup>
              </section>

              {/* Progress Section */}
              <section className="space-y-4" id="progress">
                <h2 className="font-semibold text-xl">Progress</h2>
                <div className="w-96 space-y-2">
                  <Progress value={33} />
                  <Progress value={66} />
                  <Progress value={100} />
                </div>
              </section>

              {/* Skeleton Section */}
              <section className="space-y-4" id="skeleton">
                <h2 className="font-semibold text-xl">Skeleton</h2>
                <div className="w-96 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </section>

              {/* Separator Section */}
              <section className="space-y-4" id="separator">
                <h2 className="font-semibold text-xl">Separator</h2>
                <div className="w-96">
                  <p>Content above</p>
                  <Separator />
                  <p>Content below</p>
                </div>
              </section>

              {/* Sheet Section */}
              <section className="space-y-4" id="sheet">
                <h2 className="font-semibold text-xl">Sheet</h2>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Open Sheet</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit profile</SheetTitle>
                      <SheetDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right" htmlFor="name">
                          Name
                        </Label>
                        <Input
                          className="col-span-3"
                          id="name"
                          value="Pedro Duarte"
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </section>

              {/* Dropdown Menu Section */}
              <section className="space-y-4" id="dropdown-menu">
                <h2 className="font-semibold text-xl">Dropdown Menu</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Options</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </section>

              {/* Dialog Section */}
              <section className="space-y-4" id="dialog">
                <h2 className="font-semibold text-xl">Dialog</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </section>

              {/* Popover Section */}
              <section className="space-y-4" id="popover">
                <h2 className="font-semibold text-xl">Popover</h2>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Open Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p>This is a popover content.</p>
                  </PopoverContent>
                </Popover>
              </section>

              {/* Tooltip Section */}
              <section className="space-y-4" id="tooltip">
                <h2 className="font-semibold text-xl">Tooltip</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip</p>
                  </TooltipContent>
                </Tooltip>
              </section>

              {/* Table Section */}
              <section className="space-y-4" id="table">
                <h2 className="font-semibold text-xl">Table</h2>
                <Table className="w-96">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>John Doe</TableCell>
                      <TableCell>Active</TableCell>
                      <TableCell>Admin</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>Inactive</TableCell>
                      <TableCell>User</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>

              {/* Alert Dialog Section */}
              <section className="space-y-4" id="alert-dialog">
                <h2 className="font-semibold text-xl">Alert Dialog</h2>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Show Dialog</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </section>

              {/* Aspect Ratio Section */}
              <section className="space-y-4" id="aspect-ratio">
                <h2 className="font-semibold text-xl">Aspect Ratio</h2>
                <div className="w-96">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      alt="Image"
                      className="rounded-md object-cover"
                      src="https://images.unsplash.com/photo-1588342316154-5b1b2b3b4b5b?w=800&h=450&fit=crop"
                    />
                  </AspectRatio>
                </div>
              </section>

              {/* Breadcrumb Section */}
              <section className="space-y-4" id="breadcrumb">
                <h2 className="font-semibold text-xl">Breadcrumb</h2>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/components">
                        Components
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </section>

              {/* Button Group Section */}
              <section className="space-y-4" id="button-group">
                <h2 className="font-semibold text-xl">Button Group</h2>
                <ButtonGroup>
                  <Button>Left</Button>
                  <Button>Middle</Button>
                  <Button>Right</Button>
                </ButtonGroup>
              </section>

              {/* Calendar Section */}
              <section className="space-y-4" id="calendar">
                <h2 className="font-semibold text-xl">Calendar</h2>
                <Calendar
                  className="rounded-md border"
                  mode="single"
                  selected={new Date()}
                />
              </section>

              {/* Carousel Section */}
              <section className="space-y-4" id="carousel">
                <h2 className="font-semibold text-xl">Carousel</h2>
                <Carousel className="w-96">
                  <CarouselContent>
                    <CarouselItem>
                      <div className="rounded-lg border p-4">
                        <h3 className="font-semibold text-lg">Slide 1</h3>
                        <p>First slide content</p>
                      </div>
                    </CarouselItem>
                    <CarouselItem>
                      <div className="rounded-lg border p-4">
                        <h3 className="font-semibold text-lg">Slide 2</h3>
                        <p>Second slide content</p>
                      </div>
                    </CarouselItem>
                    <CarouselItem>
                      <div className="rounded-lg border p-4">
                        <h3 className="font-semibold text-lg">Slide 3</h3>
                        <p>Third slide content</p>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </section>

              {/* Collapsible Section */}
              <section className="space-y-4" id="collapsible">
                <h2 className="font-semibold text-xl">Collapsible</h2>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost">Toggle Content</Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    <p>
                      This is collapsible content that can be shown or hidden.
                    </p>
                    <p>It can contain multiple elements and complex layouts.</p>
                  </CollapsibleContent>
                </Collapsible>
              </section>

              {/* Command Section */}
              <section className="space-y-4" id="command">
                <h2 className="font-semibold text-xl">Command</h2>
                <Command className="w-96">
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      <CommandItem>
                        <span>Calendar</span>
                      </CommandItem>
                      <CommandItem>
                        <span>Search</span>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </section>

              {/* Context Menu Section */}
              <section className="space-y-4" id="context-menu">
                <h2 className="font-semibold text-xl">Context Menu</h2>
                <ContextMenu>
                  <ContextMenuTrigger className="w-96 cursor-pointer rounded-lg border p-4">
                    Right click here
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>New Tab</ContextMenuItem>
                    <ContextMenuItem>New Window</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuSub>
                      <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
                      <ContextMenuSubContent>
                        <ContextMenuItem>Email link</ContextMenuItem>
                        <ContextMenuItem>Messages</ContextMenuItem>
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                  </ContextMenuContent>
                </ContextMenu>
              </section>

              {/* Drawer Section */}
              <section className="space-y-4" id="drawer">
                <h2 className="font-semibold text-xl">Drawer</h2>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline">Open Drawer</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Are you sure?</DrawerTitle>
                      <DrawerDescription>
                        This action cannot be undone.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button>Cancel</Button>
                      <Button variant="destructive">Delete</Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </section>

              {/* Empty Section */}
              <section className="space-y-4" id="empty">
                <h2 className="font-semibold text-xl">Empty</h2>
                <Empty
                  description="There are no items to display."
                  title="No data"
                />
              </section>

              {/* Hover Card Section */}
              <section className="space-y-4" id="hover-card">
                <h2 className="font-semibold text-xl">Hover Card</h2>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="outline">@hovercard</Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Hover Card</h4>
                      <p className="text-muted-foreground text-sm">
                        This content appears when you hover over the trigger.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </section>

              {/* Input OTP Section */}
              <section className="space-y-4" id="input-otp">
                <h2 className="font-semibold text-xl">Input OTP</h2>
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </section>

              {/* KBD Section */}
              <section className="space-y-4" id="kbd">
                <h2 className="font-semibold text-xl">KBD</h2>
                <div className="space-y-2">
                  <div>
                    <Kbd>⌘</Kbd>
                    <span className="mx-2">+</span>
                    <Kbd>K</Kbd>
                  </div>
                  <div>
                    Press <Kbd>⌘</Kbd> + <Kbd>C</Kbd> to copy
                  </div>
                </div>
              </section>

              {/* Native Select Section */}
              <section className="space-y-4" id="native-select">
                <h2 className="font-semibold text-xl">Native Select</h2>
                <NativeSelect>
                  <option value="">Choose an option</option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                  <option value="3">Option 3</option>
                </NativeSelect>
              </section>

              {/* Pagination Section */}
              <section className="space-y-4" id="pagination">
                <h2 className="font-semibold text-xl">Pagination</h2>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </section>

              {/* Resizable Section */}
              <section className="space-y-4" id="resizable">
                <h2 className="font-semibold text-xl">Resizable</h2>
                <div className="h-48 w-96 rounded-lg border p-4">
                  <div className="flex h-full">
                    <div className="w-1/4 border-r p-2">
                      <h4 className="font-semibold">Panel 1</h4>
                    </div>
                    <div className="flex-1 p-2">
                      <h4 className="font-semibold">Panel 2</h4>
                    </div>
                  </div>
                </div>
              </section>

              {/* Scroll Area Section */}
              <section className="space-y-4" id="scroll-area">
                <h2 className="font-semibold text-xl">Scroll Area</h2>
                <ScrollArea className="h-48 w-96 rounded-lg border p-4">
                  <div className="space-y-2">
                    <p>This is scrollable content.</p>
                    <p>
                      You can scroll through this content using the scrollbar.
                    </p>
                    <p>
                      It provides a better scrolling experience than native
                      scrollbars.
                    </p>
                    <p>
                      The scrollbar is styled consistently with the rest of the
                      UI.
                    </p>
                    <p>It works well with both mouse and touch interactions.</p>
                    <p>
                      Perfect for lists, tables, and other overflow content.
                    </p>
                    <p>Customizable appearance and behavior.</p>
                    <p>Accessible and keyboard navigable.</p>
                  </div>
                </ScrollArea>
              </section>

              {/* Slider Section */}
              <section className="space-y-4" id="slider">
                <h2 className="font-semibold text-xl">Slider</h2>
                <div className="w-96 space-y-4">
                  <Slider defaultValue={[33]} max={100} step={1} />
                  <Slider defaultValue={[50]} max={100} step={1} />
                  <Slider defaultValue={[75]} max={100} step={1} />
                </div>
              </section>

              {/* Spinner Section */}
              <section className="space-y-4" id="spinner">
                <h2 className="font-semibold text-xl">Spinner</h2>
                <div className="flex gap-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-gray-900 border-b-2" />
                  <div className="h-4 w-4 animate-spin rounded-full border-gray-900 border-b-2" />
                  <div className="h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2" />
                </div>
              </section>

              {/* Toggle Section */}
              <section className="space-y-4" id="toggle">
                <h2 className="font-semibold text-xl">Toggle</h2>
                <div className="flex gap-2">
                  <Toggle>Default</Toggle>
                  <Toggle variant="outline">Outline</Toggle>
                </div>
              </section>

              {/* Toggle Group Section */}
              <section className="space-y-4" id="toggle-group">
                <h2 className="font-semibold text-xl">Toggle Group</h2>
                <ToggleGroup type="single">
                  <ToggleGroupItem value="left">Left</ToggleGroupItem>
                  <ToggleGroupItem value="center">Center</ToggleGroupItem>
                  <ToggleGroupItem value="right">Right</ToggleGroupItem>
                </ToggleGroup>
              </section>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export const Route = createFileRoute("/uidemo")({
  component: UIDemoPage,
});
