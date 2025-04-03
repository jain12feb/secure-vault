"use client";

import React, { useEffect, useState } from "react";
// import { useNotification } from "@/context-api/NotificationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Bell, CheckCheck, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
// import { useNotifications } from "@/hooks/useNotifications";
// import { useUserProfile } from "@/context-api/UserProfileContext";

export default function NotificationDropdown() {
  // const {
  //   notifications,
  //   markAsRead,
  //   removeNotification,
  //   unreadCount,
  //   removeAllNotifications,
  //   isNotificationsLoading,
  // } = useNotification();

  const [notifications, setNotifications] = useState([
    {
      id: "",
      userId: "",
      message: "",
      type: "",
      isRead: false,
      createdAt: "",
    },
  ]);

  const unreadCount = notifications.filter((not) => !not.isRead).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((not) => (not.id === id ? { ...not, isRead: true } : not))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((not) => ({ ...not, isRead: true })));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setNotifications((prevNotifications) =>
      prevNotifications.filter((noti) => noti.id !== id)
    );
  };

  useEffect(() => {
    setNotifications([
      {
        id: "64f9e8b2d8f4e2a9b9e6c123",
        userId: "64f9e8b2d8f4e2a9b9e6c001",
        message: "Your password has been successfully added.",
        type: "password_added",
        isRead: false,
        createdAt: "2023-09-01T10:15:30Z",
      },
      {
        id: "64f9e8b2d8f4e2a9b9e6c124",
        userId: "64f9e8b2d8f4e2a9b9e6c002",
        message: "Your password has been updated successfully.",
        type: "password_updated",
        isRead: true,
        createdAt: "2023-09-02T14:20:45Z",
      },
      {
        id: "64f9e8b2d8f4e2a9b9e6c125",
        userId: "64f9e8b2d8f4e2a9b9e6c003",
        message: "New login detected from an unknown device.",
        type: "security_alert",
        isRead: false,
        createdAt: "2023-09-03T08:50:12Z",
      },
      {
        id: "64f9e8b2d8f4e2a9b9e6c126",
        userId: "64f9e8b2d8f4e2a9b9e6c004",
        message: "Your account has been successfully verified.",
        type: "account_verified",
        isRead: true,
        createdAt: "2023-09-04T11:30:00Z",
      },
      {
        id: "64f9e8b2d8f4e2a9b9e6c127",
        userId: "64f9e8b2d8f4e2a9b9e6c005",
        message:
          "Password reset request received. If this wasn’t you, please contact support.",
        type: "password_reset_request",
        isRead: false,
        createdAt: "2023-09-05T16:45:22Z",
      },
    ]);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative mr-2 h-9 w-9"
          size="icon"
          aria-label={`Notifications ${
            unreadCount > 0 ? `(${unreadCount} unread)` : ""
          }`}
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute px-1 py-0 -top-1 -right-1 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-96 p-1.5 shadow-lg rounded-xl">
        <div className="flex justify-between items-center px-2 pb-2 border-b">
          <h3 className="flex items-center gap-1 text-sm font-semibold">
            <p>Notifications</p>
          </h3>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              className="text-xs h-7 px-2"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {false ? (
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <p className="text-muted-foreground mb-2">No notifications</p>
            <p className="text-xs text-muted-foreground">
              When you receive notifications, they will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-80 space-y-1 pr-2">
            {notifications.map((notif, id) => (
              <DropdownMenuItem
                key={id}
                className={cn(
                  "flex flex-col justify-between min-h-16 px-3 py-2 my-1 mr-1 relative",
                  !notif.isRead && "bg-muted/50"
                )}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex items-start justify-between gap-2 w-full mx-auto pr-6">
                  <p
                    className={cn(
                      "text-sm",
                      !notif.isRead && "font-medium text-primary"
                    )}
                  >
                    {notif.message}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 w-full mx-auto mt-1">
                  {/* <div className="flex items-center justify-start gap-1 text-xs text-muted-foreground">
                    <p>
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        includeSeconds: true,
                        addSuffix: true,
                      })}
                    </p>
                  </div> */}
                  {notif.isRead && (
                    <p className="flex items-center justify-start gap-1 text-xs text-muted-foreground">
                      <CheckCheck className="w-3 h-3" /> <span>read</span>
                    </p>
                  )}
                </div>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-1 h-6 w-6"
                  // onClick={(e) => handleDelete(e, notif.id)}
                  aria-label="Delete notification"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button> */}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
