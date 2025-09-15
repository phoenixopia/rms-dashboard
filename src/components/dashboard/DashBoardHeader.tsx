"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth"; // Adjust path if necessary // Adjust path if necessary
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, LogOut, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "../custome/shared/ModeToggle";
import { SidebarTrigger } from "../ui/sidebar";
import { getAuthToken } from "@/auth/auth";
import axios from "axios";
import { BASEURL } from "@/actions/api";

export function DashboardHeader() {
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = await getAuthToken();
      const res = await axios.get(`${BASEURL}/notification/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = await getAuthToken();
      const res = await axios.get(`${BASEURL}/notification/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUnreadCount(res.data.data.unread || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = await getAuthToken();
      await axios.put(
        `${BASEURL}/notification/mark-as-read/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await getAuthToken();
      await axios.put(
        `${BASEURL}/notification/mark-all-as-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = await getAuthToken();
      await axios.delete(`${BASEURL}/notification/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  return (
    <header className="bg-card shadow-accent sticky top-0 z-40 w-full px-4 shadow-md">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Left Side: User Info */}
        <div className="flex items-center space-x-3">
          <SidebarTrigger variant="secondary" className="cursor-pointer" />
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={
                user?.profile_picture ??
                "https://cdn-icons-png.flaticon.com/128/15842/15842998.png"
              }
              alt={user?.full_name ?? "Test Admin"}
            />
            <AvatarFallback>{user?.full_name ?? "Test Admin"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user?.full_name ?? "Test Admin"}
            </span>
            <span className="text-muted-foreground text-xs">
              {user?.email ?? user?.phone_number ?? "N/A"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />

          {/* Notifications */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                {notifications.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={markAllAsRead}
                    className="flex items-center space-x-1"
                  >
                    <CheckCheck className="h-4 w-4" />
                    <span>Mark all as read</span>
                  </Button>
                )}
              </SheetHeader>
              <div className="py-4">
                {/* Add your notification list here */}
                <p className="text-muted-foreground text-sm">
                  No new notifications.
                </p>
              </div>
              <div className="space-y-3 py-4">
                {notifications.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No notifications found.
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex items-start justify-between rounded-lg border p-3 transition ${
                        notif.is_read ? "bg-white" : "bg-blue-100"
                      }`}
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => markAsRead(notif.id)}
                      >
                        <h4 className="font-medium">{notif.title}</h4>
                        <p className="text-muted-foreground text-sm">
                          {notif.message}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notif.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logout Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
