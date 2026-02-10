import { useEffect, useState } from "react";

export function useUnreadMessageCount() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch initial count
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/messages/unread-count");
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();

    // Poll every 10 seconds
    const interval = setInterval(fetchUnreadCount, 10000);

    return () => clearInterval(interval);
  }, []);

  return unreadCount;
}
