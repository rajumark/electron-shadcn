import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ButtonGroup } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Combobox } from "@/components/ui/combobox"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Empty } from "@/components/ui/empty"
import { Field } from "@/components/ui/field"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Item } from "@/components/ui/item"
import { Kbd } from "@/components/ui/kbd"
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar"
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "@/components/ui/navigation-menu"
import { NativeSelect } from "@/components/ui/native-select"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Toaster } from "@/components/ui/sonner"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function UIDemoPage() {
  const { t } = useTranslation();

  return (
    <TooltipProvider>
      <div className="mb-2 flex h-[calc(100vh-8rem)]">
        <div className="relative flex flex-1">
          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center gap-2 mb-6">
              <h1 className="font-bold text-2xl">UI Demo</h1>
              <Badge variant="secondary">Coming soon</Badge>
            </div>

            <div className="space-y-8">
            {/* Badge Section */}
            <section id="badge" className="space-y-4">
              <h2 className="text-xl font-semibold">Badge</h2>
              <div className="flex gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </section>

            {/* Button Section */}
            <section id="button" className="space-y-4">
              <h2 className="text-xl font-semibold">Button</h2>
              <div className="flex gap-2 flex-wrap">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </section>

            {/* Card Section */}
            <section id="card" className="space-y-4">
              <h2 className="text-xl font-semibold">Card</h2>
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
            <section id="input" className="space-y-4">
              <h2 className="text-xl font-semibold">Input</h2>
              <div className="space-y-2 max-w-md">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" />
                </div>
              </div>
            </section>

            {/* Select Section */}
            <section id="select" className="space-y-4">
              <h2 className="text-xl font-semibold">Select</h2>
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
            <section id="switch" className="space-y-4">
              <h2 className="text-xl font-semibold">Switch</h2>
              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications">Enable notifications</Label>
              </div>
            </section>

            {/* Textarea Section */}
            <section id="textarea" className="space-y-4">
              <h2 className="text-xl font-semibold">Textarea</h2>
              <div className="max-w-md">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message here." />
              </div>
            </section>

            {/* Tabs Section */}
            <section id="tabs" className="space-y-4">
              <h2 className="text-xl font-semibold">Tabs</h2>
              <Tabs defaultValue="account" className="w-96">
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
            <section id="accordion" className="space-y-4">
              <h2 className="text-xl font-semibold">Accordion</h2>
              <Accordion type="single" collapsible className="w-96">
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
            <section id="alert" className="space-y-4">
              <h2 className="text-xl font-semibold">Alert</h2>
              <div className="space-y-2 max-w-md">
                <Alert>
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>This is an information alert.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>This is an error alert.</AlertDescription>
                </Alert>
              </div>
            </section>

            {/* Avatar Section */}
            <section id="avatar" className="space-y-4">
              <h2 className="text-xl font-semibold">Avatar</h2>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </section>

            {/* Checkbox Section */}
            <section id="checkbox" className="space-y-4">
              <h2 className="text-xl font-semibold">Checkbox</h2>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>
            </section>

            {/* Radio Group Section */}
            <section id="radio-group" className="space-y-4">
              <h2 className="text-xl font-semibold">Radio Group</h2>
              <RadioGroup defaultValue="option-one">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">Option One</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">Option Two</Label>
                </div>
              </RadioGroup>
            </section>

            {/* Progress Section */}
            <section id="progress" className="space-y-4">
              <h2 className="text-xl font-semibold">Progress</h2>
              <div className="space-y-2 w-96">
                <Progress value={33} />
                <Progress value={66} />
                <Progress value={100} />
              </div>
            </section>

            {/* Skeleton Section */}
            <section id="skeleton" className="space-y-4">
              <h2 className="text-xl font-semibold">Skeleton</h2>
              <div className="space-y-2 w-96">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </section>

            {/* Separator Section */}
            <section id="separator" className="space-y-4">
              <h2 className="text-xl font-semibold">Separator</h2>
              <div className="w-96">
                <p>Content above</p>
                <Separator />
                <p>Content below</p>
              </div>
            </section>

            {/* Sheet Section */}
            <section id="sheet" className="space-y-4">
              <h2 className="text-xl font-semibold">Sheet</h2>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                      Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" value="Pedro Duarte" className="col-span-3" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </section>

            {/* Dropdown Menu Section */}
            <section id="dropdown-menu" className="space-y-4">
              <h2 className="text-xl font-semibold">Dropdown Menu</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </section>

            {/* Dialog Section */}
            <section id="dialog" className="space-y-4">
              <h2 className="text-xl font-semibold">Dialog</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </section>

            {/* Popover Section */}
            <section id="popover" className="space-y-4">
              <h2 className="text-xl font-semibold">Popover</h2>
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
            <section id="tooltip" className="space-y-4">
              <h2 className="text-xl font-semibold">Tooltip</h2>
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
            <section id="table" className="space-y-4">
              <h2 className="text-xl font-semibold">Table</h2>
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
            <section id="alert-dialog" className="space-y-4">
              <h2 className="text-xl font-semibold">Alert Dialog</h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Show Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
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
            <section id="aspect-ratio" className="space-y-4">
              <h2 className="text-xl font-semibold">Aspect Ratio</h2>
              <div className="w-96">
                <AspectRatio ratio={16 / 9}>
                  <img src="https://images.unsplash.com/photo-1588342316154-5b1b2b3b4b5b?w=800&h=450&fit=crop" alt="Image" className="rounded-md object-cover" />
                </AspectRatio>
              </div>
            </section>

            {/* Breadcrumb Section */}
            <section id="breadcrumb" className="space-y-4">
              <h2 className="text-xl font-semibold">Breadcrumb</h2>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </section>

            {/* Button Group Section */}
            <section id="button-group" className="space-y-4">
              <h2 className="text-xl font-semibold">Button Group</h2>
              <ButtonGroup>
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </section>

            {/* Calendar Section */}
            <section id="calendar" className="space-y-4">
              <h2 className="text-xl font-semibold">Calendar</h2>
              <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-md border"
              />
            </section>

            {/* Carousel Section */}
            <section id="carousel" className="space-y-4">
              <h2 className="text-xl font-semibold">Carousel</h2>
              <Carousel className="w-96">
                <CarouselContent>
                  <CarouselItem>
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-semibold">Slide 1</h3>
                      <p>First slide content</p>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-semibold">Slide 2</h3>
                      <p>Second slide content</p>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-semibold">Slide 3</h3>
                      <p>Third slide content</p>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </section>

            {/* Collapsible Section */}
            <section id="collapsible" className="space-y-4">
              <h2 className="text-xl font-semibold">Collapsible</h2>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost">Toggle Content</Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  <p>This is collapsible content that can be shown or hidden.</p>
                  <p>It can contain multiple elements and complex layouts.</p>
                </CollapsibleContent>
              </Collapsible>
            </section>

            {/* Command Section */}
            <section id="command" className="space-y-4">
              <h2 className="text-xl font-semibold">Command</h2>
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
            <section id="context-menu" className="space-y-4">
              <h2 className="text-xl font-semibold">Context Menu</h2>
              <ContextMenu>
                <ContextMenuTrigger className="w-96 p-4 border rounded-lg cursor-pointer">
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
            <section id="drawer" className="space-y-4">
              <h2 className="text-xl font-semibold">Drawer</h2>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Are you sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button>Cancel</Button>
                    <Button variant="destructive">Delete</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </section>

            {/* Empty Section */}
            <section id="empty" className="space-y-4">
              <h2 className="text-xl font-semibold">Empty</h2>
              <Empty
                title="No data"
                description="There are no items to display."
              />
            </section>

            {/* Hover Card Section */}
            <section id="hover-card" className="space-y-4">
              <h2 className="text-xl font-semibold">Hover Card</h2>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline">@hovercard</Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Hover Card</h4>
                    <p className="text-sm text-muted-foreground">
                      This content appears when you hover over the trigger.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </section>

            {/* Input OTP Section */}
            <section id="input-otp" className="space-y-4">
              <h2 className="text-xl font-semibold">Input OTP</h2>
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
            <section id="kbd" className="space-y-4">
              <h2 className="text-xl font-semibold">KBD</h2>
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
            <section id="native-select" className="space-y-4">
              <h2 className="text-xl font-semibold">Native Select</h2>
              <NativeSelect>
                <option value="">Choose an option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </NativeSelect>
            </section>

            {/* Pagination Section */}
            <section id="pagination" className="space-y-4">
              <h2 className="text-xl font-semibold">Pagination</h2>
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
            <section id="resizable" className="space-y-4">
              <h2 className="text-xl font-semibold">Resizable</h2>
              <div className="w-96 h-48 border rounded-lg p-4">
                <div className="flex h-full">
                  <div className="w-1/4 p-2 border-r">
                    <h4 className="font-semibold">Panel 1</h4>
                  </div>
                  <div className="flex-1 p-2">
                    <h4 className="font-semibold">Panel 2</h4>
                  </div>
                </div>
              </div>
            </section>

            {/* Scroll Area Section */}
            <section id="scroll-area" className="space-y-4">
              <h2 className="text-xl font-semibold">Scroll Area</h2>
              <ScrollArea className="w-96 h-48 border rounded-lg p-4">
                <div className="space-y-2">
                  <p>This is scrollable content.</p>
                  <p>You can scroll through this content using the scrollbar.</p>
                  <p>It provides a better scrolling experience than native scrollbars.</p>
                  <p>The scrollbar is styled consistently with the rest of the UI.</p>
                  <p>It works well with both mouse and touch interactions.</p>
                  <p>Perfect for lists, tables, and other overflow content.</p>
                  <p>Customizable appearance and behavior.</p>
                  <p>Accessible and keyboard navigable.</p>
                </div>
              </ScrollArea>
            </section>

            {/* Slider Section */}
            <section id="slider" className="space-y-4">
              <h2 className="text-xl font-semibold">Slider</h2>
              <div className="w-96 space-y-4">
                <Slider defaultValue={[33]} max={100} step={1} />
                <Slider defaultValue={[50]} max={100} step={1} />
                <Slider defaultValue={[75]} max={100} step={1} />
              </div>
            </section>

            {/* Spinner Section */}
            <section id="spinner" className="space-y-4">
              <h2 className="text-xl font-semibold">Spinner</h2>
              <div className="flex gap-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            </section>

            {/* Toggle Section */}
            <section id="toggle" className="space-y-4">
              <h2 className="text-xl font-semibold">Toggle</h2>
              <div className="flex gap-2">
                <Toggle>Default</Toggle>
                <Toggle variant="outline">Outline</Toggle>
              </div>
            </section>

            {/* Toggle Group Section */}
            <section id="toggle-group" className="space-y-4">
              <h2 className="text-xl font-semibold">Toggle Group</h2>
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
