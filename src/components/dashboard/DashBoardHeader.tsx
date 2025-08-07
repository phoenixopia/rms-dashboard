"use client";

import { useAuth } from "@/lib/auth"; // Adjust path if necessary // Adjust path if necessary
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User as UserIcon } from "lucide-react";
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

export function DashboardHeader() {
  const { user, logout } = useAuth();

  //   const fullName =
  //     user?.first_name && user?.last_name
  //       ? `${user.first_name} ${user.last_name}`
  //       : "Guest User";
  //   const userEmail = user?.email || "No email available";
  //   const profilePic =
  //     user?.profile_picture || "https://placehold.co/40x40/FF7632/FFFFFF?text=U"; // Default placeholder

  return (
    <header className="bg-card shadow-accent sticky top-0 z-40 w-full px-4 shadow-md">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Left Side: User Info */}
        <div className="flex items-center space-x-3">
          <SidebarTrigger variant="secondary" className="cursor-pointer" />
          <Avatar className="h-9 w-9">
            <AvatarImage
              src="https://cdn-icons-png.flaticon.com/128/15842/15842998.png"
              alt={"Test Admin"}
            />
            <AvatarFallback>{"Test Admin"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{"Test Admin"}</span>
            <span className="text-muted-foreground text-xs">
              {"testadmin@gmail.com"}
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
                {/* Optional: Notification badge */}
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {/* Add your notification list here */}
                <p className="text-muted-foreground text-sm">
                  No new notifications.
                </p>
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
