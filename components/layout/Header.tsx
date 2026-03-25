"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";
import { useAuth } from "@/context/userContext";
// import {
//   formatNotificationTime,
//   getNotificationTypeColor,
//   getNotificationTypeIcon,
//   getUserInitials,
// } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import icon from "@/public/assets/icon/logo-light.png";
import { useNotifications, useUnreadCount } from "@/queries/notifications";
import type { NavItem } from "@/types/header";
import {
  Bell,
  Calendar,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Settings,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use actual media query for responsive check
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen scroll for sticky effect (optional, or remove if unused)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname();
  const { user, initializing, logout } = useAuth();
  const { data: unreadCountData } = useUnreadCount();
  const unreadCount = unreadCountData?.data?.unread_count ?? 0;

  // For handling notification "read" actions (stub)
  const [readingId, setReadingId] = useState<string | null>(null);
  const handleNotificationClick = (id: string) => {
    setReadingId(id);
    // implement the logic that marks notification as read
    // .finally(() => setReadingId(null));
    setTimeout(() => setReadingId(null), 1000); // demo purpose
  };

  // For notification label (Name fallback)
  const name =
    user && (user.first_name || user.last_name)
      ? `${user.role === "doctor" ? "Dr. " : ""}${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
      : "User";

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "My Schedules",
      href: "/schedule",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Appointments",
      href: "/appointments",
      icon: <UserIcon className="h-4 w-4" />,
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: <Bell className="h-4 w-4" />,
      badge: unreadCount,
    },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b"
          : "bg-background",
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Logo and App Name */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={icon}
            alt="Logo"
            width={180}
            height={32}
            className="w-32 md:w-44 h-auto"
            priority
          />
        </Link>

        {isDesktop && (
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground bg-accent hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {item.icon}
                <span>{item.title}</span>
                {item.badge ? (
                  <Badge
                    variant={pathname === item.href ? "secondary" : "default"}
                    className="ml-auto flex h-5 w-5 items-center justify-center rounded-full p-0"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                ) : null}
              </Link>
            ))}
          </nav>
        )}



        {/* Action Buttons */}
        <div className="flex items-center gap-4">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <ScrollArea className="h-[300px]">

                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              </ScrollArea>

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/doctor/notifications" className="w-full justify-center">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {(user || initializing) ? (
            <div className="flex items-center gap-3 pl-2 border-l">
              <div className="flex-col text-right hidden lg:flex">
                <span className="text-sm font-semibold leading-none">
                  {initializing ? "unknown name" : name}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {initializing ? "unknown email" : (user?.email || "healthcare@info.test")}
                </span>
              </div>
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full border-0 p-0 hover:bg-transparent">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.avatar || ""}
                          alt={name}
                        />
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-row items-center justify-between min-w-0">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm leading-none font-medium truncate">
                            {initializing ? "" : name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground truncate">
                            {initializing ? "" : (user?.email || "Not signed in")}
                          </p>
                        </div>
                        {!initializing && user?.role && (
                          <Badge variant="outline" className="ml-2 h-5 w-fit capitalize">
                            {user.role}
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/doctor/profile" className="cursor-pointer">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/doctor/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={logout}
                      disabled={initializing}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {!isDesktop && (
                  <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2 text-left">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <span className="text-lg font-bold text-primary-foreground">
                              HP
                            </span>
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold">HealthCare Pro</h2>
                            <p className="text-xs text-muted-foreground">
                              Telehealth Platform
                            </p>
                          </div>
                        </SheetTitle>
                      </SheetHeader>

                      <Separator className="my-4" />

                      <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                              pathname === item.href
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            )}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                            {item.badge ? (
                              <Badge className="ml-auto">
                                {item.badge > 99 ? "99+" : item.badge}
                              </Badge>
                            ) : null}
                          </Link>
                        ))}
                      </nav>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>
          ) : (
            !initializing && (
              <Link
                href="/auth/login"
                className="text-sm font-medium text-primary hover:underline px-4 py-2"
              >
                Sign In
              </Link>
            )
          )}

        </div>
      </div>
    </header>
  );
}
