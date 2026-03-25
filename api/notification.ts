import api from "@/lib/axios";

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    unread_count: number;
  };
}

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const { data } = await api.get("/notifications/unread-count");
  return data;
};
