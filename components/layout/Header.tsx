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
import { cn } from "@/lib/utils";
import icon from "@/public/assets/icon/logo-light.png";
import { useNotifications, useReadNotification, useUnreadCount } from "@/queries/notifications";
import type { NavItem } from "@/types/header";
import {
  Bell,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Clock,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };
  const getNotificationTypeIcon = (group: string) => {
    switch (group?.toLowerCase()) {
      case "appointment":
        return <Calendar className="h-4 w-4" />;
      case "review":
        return <Settings className="h-4 w-4 text-amber-500" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "availability":
        return <Clock className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };
  const getNotificationTypeColor = (group: string) => {
    switch (group?.toLowerCase()) {
      case "appointment":
        return "text-blue-600";
      case "review":
        return "text-amber-500";
      case "document":
        return "text-rose-600";
      case "availability":
        return "text-emerald-600";
      default:
        return "text-primary";
    }
  };
  const formatNotificationTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };
  const pathname = usePathname();
  const { user, initializing, logout } = useAuth();
  const { data: notificationsData, isLoading } = useNotifications();
  const markAsReadMutation = useReadNotification();
  const unreadCount = notificationsData?.meta?.total_unread ?? 0;
  const notifications = notificationsData?.data ?? [];
  const topFiveNotifications = notifications.slice(0, 5);
  // For handling notification "read" actions
  const [readingId, setReadingId] = useState<string | null>(null);
  const handleNotificationClick = async (id: string) => {
    setReadingId(id);
    try {
      await markAsReadMutation.mutateAsync(id);
    } finally {
      setReadingId(null);
    }
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
      href: "/my-schedules",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Appointments",
      href: "/appointments",
      icon: <UserIcon className="h-4 w-4" />,
    },
    {
      title: "Feedbacks",
      href: "/feedbacks",
      icon: <MessageSquare className="h-4 w-4" />,
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
      <div className=" flex h-16 items-center justify-between px-4 sm:px-8 container mx-auto">
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
          <nav className="flex items-center gap-4">
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
                    {Number(item.badge) > 99 ? "99+" : item.badge}
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
                  <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[calc(100vw-2rem)] sm:w-80"
            >
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : topFiveNotifications.length > 0 ? (
                  topFiveNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "flex cursor-pointer flex-col items-start gap-2 p-3",
                        !notification.is_read && "bg-accent/50"
                      )}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex w-full items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <span
                            className={cn(
                              "shrink-0",
                              getNotificationTypeColor(notification.group)
                            )}
                          >
                            {getNotificationTypeIcon(notification.group)}
                          </span>
                          <span className="truncate text-sm font-medium">
                            {notification.title}
                          </span>
                        </div>
                        <span className="shrink-0 text-xs whitespace-nowrap text-muted-foreground">
                          {formatNotificationTime(notification.created_at)}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {notification.desc}
                      </p>
                      <div className="flex w-full items-center justify-between">
                        <Badge
                          variant="outline"
                          className={cn(
                            "mt-1 text-xs",
                            getNotificationTypeColor(notification.group)
                          )}
                        >
                          {notification.group}
                        </Badge>
                        {readingId === notification.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          notification.is_read && (
                            <Badge variant="secondary" className="text-[10px]">
                              Read
                            </Badge>
                          )
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                )}
              </ScrollArea>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/notifications"
                  className="w-full justify-center"
                >
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {user || initializing ? (
            <div className="flex items-center gap-3 pl-2 border-l">
              <div className="flex-col text-right hidden lg:flex">
                <span className="text-sm font-semibold leading-none">
                  {initializing ? "unknown name" : name}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {initializing
                    ? "unknown email"
                    : user?.email || "healthcare@info.test"}
                </span>
              </div>
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full border-0 p-0 hover:bg-transparent"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || ""} alt={name} />
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
                            {initializing ? "" : user?.email || "Not signed in"}
                          </p>
                        </div>
                        {!initializing && user?.role && (
                          <Badge
                            variant="outline"
                            className="ml-2 h-5 w-fit capitalize"
                          >
                            {user.role}
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/doctor/settings"
                          className="cursor-pointer"
                        >
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
                  <Sheet
                    open={isMobileMenuOpen}
                    onOpenChange={setIsMobileMenuOpen}
                  >
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[300px] sm:w-[400px]"
                    >
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2 text-left">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <span className="text-lg font-bold text-primary-foreground">
                              HP
                            </span>
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold">
                              HealthCare Pro
                            </h2>
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
                                {Number(item.badge) > 99 ? "99+" : item.badge}
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