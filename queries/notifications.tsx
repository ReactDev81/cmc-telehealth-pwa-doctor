import { getUnreadCount } from "@/api/notification";
import { useQuery } from "@tanstack/react-query";

enum QueryKeys {
  NOTIFICATIONS_UNREAD_COUNT = "notifications_unread_count",
}

export function useUnreadCount() {
  return useQuery({
    queryKey: [QueryKeys.NOTIFICATIONS_UNREAD_COUNT],
    queryFn: getUnreadCount,
    refetchInterval: 60000, // Optional: Poll every 1 minute
  });
}
