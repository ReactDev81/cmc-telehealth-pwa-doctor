"use client";

import { CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./button";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  created_at: string;
  is_read: boolean;
  group: string;
}

interface NotificationsCardContentProps {
  notifications: NotificationItem[];
  loading?: boolean;
  error?: string | null;

  limit?: number; // default 3
  onClickItem?: (id: string) => void;
  onViewAll?: () => void;

  getIcon?: (group: string) => React.ReactNode;

  emptyTitle?: string;
  emptyMessage?: string;
}

export default function NotificationsCardContent({
  notifications = [],
  loading = false,
  error = null,
  limit = 3,
  onClickItem,
  onViewAll,
  getIcon,
  emptyTitle = "No Notifications",
  emptyMessage = "You don't have any notifications at the moment.",
}: NotificationsCardContentProps) {
  const visibleNotifications = notifications.slice(0, limit);

  return (
    <CardContent className="flex flex-col flex-1 justify-between p-0">

      {/* 🔄 Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      ) : error ? (

        /* ❌ Error */
        <div className="py-8 text-center text-sm text-destructive">
          {error}
        </div>
      ) : notifications.length === 0 ? (

        /* 📭 Empty */
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Bell size={40} className="text-muted-foreground mb-2" />
          <p className="font-medium">{emptyTitle}</p>
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>

      ) : (

        /* ✅ Data */
        <div className="space-y-4 p-4">
          {visibleNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors ${
                !notification.is_read ? "bg-accent/30" : ""
              }`}
              onClick={() => onClickItem?.(notification.id)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                {getIcon?.(notification.group)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate">
                    {notification.title}
                  </p>

                  {!notification.is_read && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {notification.desc}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* + More */}
          {notifications.length > limit && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{notifications.length - limit} more notifications
            </p>
          )}
        </div>
      )}

      {/* 🔽 Bottom Action */}
      <Button
        variant="link"
        className="text-sm hover:underline text-center"
        onClick={onViewAll}
      >
        View All Notifications
      </Button>
    </CardContent>
  );
}