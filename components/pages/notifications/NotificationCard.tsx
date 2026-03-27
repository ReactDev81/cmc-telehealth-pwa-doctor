"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Bell,
    Calendar,
    CheckCheck,
    Clock,
    FileText,
    Loader2,
    Star,
    Check,
    Eye,
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

const getIconColor = (group: string) => {
    switch (group) {
        case "appointment":
            return "text-blue-600";
        case "review":
            return "text-amber-600";
        case "availability":
            return "text-emerald-600";
        case "document":
            return "text-rose-600";
        default:
            return "text-primary";
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

    return (
        <Card
            className={cn(
                "border-border transition-colors hover:bg-accent/30",
                !notification.is_read ? "bg-primary/5 border-l-4 border-l-primary" : ""
            )}
        >
            <CardContent className="flex items-start justify-between gap-4 p-4">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div
                        className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent",
                            getIconColor(notification.group)
                        )}
                    >
                        <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                            <p className="font-medium">{notification.title}</p>

                            {notification.is_read && (
                                <Badge variant="secondary">Read</Badge>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.desc}
                        </p>

                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(notification.created_at)}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 pt-1">
                    {!notification.is_read && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRead(notification.id)}
                            disabled={isReading}
                        >
                            {isReading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Eye className="mr-2 h-4 w-4" />
                            )}
                            {isReading ? "Reading..." : "Mark as read"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
