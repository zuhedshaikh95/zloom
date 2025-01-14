"use client";

import { getNotifications } from "@/actions/user";
import { Avatar } from "@/components/ui";
import { useQueryData } from "@/hooks";
import { QueryKeysE } from "@/types";
import { UserIcon } from "lucide-react";

export default function Notifications() {
  const { data } = useQueryData({
    queryKey: [QueryKeysE.NOTIFICATIONS],
    queryFn: async () => {
      const { notifications } = await getNotifications();
      return notifications;
    },
  });

  if (data && !data?._count.notifications) {
    return (
      <div className="flex justify-center items-center">
        <p>You don't have any notifications yet!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {data?.notifications.map((notification) => (
        <div key={notification.id} className="border-2 flex gap-x-3 items-center rounded-lg p-3">
          <Avatar.Root>
            <Avatar.Fallback>
              <UserIcon />
            </Avatar.Fallback>
            <p>{notification.content}</p>
          </Avatar.Root>
        </div>
      ))}
    </div>
  );
}
