"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Bell,
    Calendar,
    CheckCheck,
    Clock,
    FileText,
    Loader2,
    Star,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationItem } from "@/types/notification";

const getNotificationIcon = (group: string) => {
    switch (group) {
        case "appointment":
            return Calendar;
        case "review":
            return Star;
        case "availability":
            return Clock;
        case "document":
            return FileText;
        default:
            return Bell;
    }
};

const getIconStyles = (group: string) => {
    switch (group) {
        case "appointment":
            return "bg-gradient-to-br from-blue-500/10 to-blue-600/5 text-blue-600 dark:from-blue-400/20 dark:to-blue-400/5 dark:text-blue-400";
        case "review":
            return "bg-gradient-to-br from-amber-500/10 to-amber-600/5 text-amber-600 dark:from-amber-400/20 dark:to-amber-400/5 dark:text-amber-400";
        case "availability":
            return "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 text-emerald-600 dark:from-emerald-400/20 dark:to-emerald-400/5 dark:text-emerald-400";
        case "document":
            return "bg-gradient-to-br from-rose-500/10 to-rose-600/5 text-rose-600 dark:from-rose-400/20 dark:to-rose-400/5 dark:text-rose-400";
        default:
            return "bg-gradient-to-br from-primary/10 to-primary/5 text-primary";
    }
};

const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const createdAt = new Date(dateString);

    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
};

interface NotificationCardProps {
    notification: NotificationItem;
    onRead: (id: string) => void;
    isReading: boolean;
}

export function NotificationCard({
    notification,
    onRead,
    isReading,
}: NotificationCardProps) {
    const Icon = getNotificationIcon(notification.group);
    const iconStyles = getIconStyles(notification.group);

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl border transition-all duration-500 w-full",
                "hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
                "hover:border-primary/20 active:scale-[0.998]",
                !notification.is_read
                    ? "bg-gradient-to-r from-primary/[0.03] to-transparent border-primary/20"
                    : "bg-card border-border/60"
            )}
        >
            {/* Unread Indicator Dot */}
            {!notification.is_read && (
                <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
            )}

            <div className="flex items-center gap-4 p-5 h-full">
                {/* Icon Container */}
                <div
                    className={cn(
                        "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-3",
                        iconStyles,
                        "after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-inset after:ring-black/5 dark:after:ring-white/5"
                    )}
                >
                    <Icon className="h-7 w-7 transition-all duration-500 group-hover:scale-110" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h4 className={cn(
                                "text-[15px] font-bold leading-tight transition-colors duration-300",
                                !notification.is_read ? "text-foreground" : "text-muted-foreground/80"
                            )}>
                                {notification.title}
                            </h4>
                            <time className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                                • {formatRelativeTime(notification.created_at)}
                            </time>
                        </div>
                        <p className="text-[13px] leading-relaxed text-muted-foreground/70 line-clamp-1">
                            {notification.desc}
                        </p>
                        <Badge
                            variant="secondary"
                            className={cn(
                                "h-5 rounded-md border-0 px-2 text-[10px] font-bold uppercase tracking-widest mt-1",
                                "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300"
                            )}
                        >
                            {notification.group}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {!notification.is_read ? (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-9 rounded-full px-4 text-[11px] font-bold text-primary hover:bg-primary/10 transition-all duration-300"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRead(notification.id);
                                }}
                                disabled={isReading}
                            >
                                {isReading ? (
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Check className="mr-2 h-3.5 w-3.5" />
                                )}
                                Mark as read
                            </Button>
                        ) : (
                            <div className="flex h-9 items-center gap-1.5 px-4 text-[11px] font-semibold text-muted-foreground/30">
                                <CheckCheck className="h-3.5 w-3.5" />
                                <span>Read</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
