import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader, LogOut, Settings, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { useUserProfile } from "@/context-api/AppProvider";

const UserAccountDropDown = () => {
  const { toast } = useToast();
  const { user, currentSession } = useUserProfile();

  const signOut = async () => {
    await logout(currentSession);
    toast({
      title: "Logged out successfully!",
    });
  };

  if(!user) return null;

  return (
    <div className="w-fit border rounded-lg px-2 py-1 flex items-center justify-between gap-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center">
            <p className="text-xs">{user.name}</p>
            <p
              style={{
                fontSize: "10px" /* 12px */,
                lineHeight: "14px" /* 16px */,
              }}
            >
              {user.email}
            </p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/profile">
              <DropdownMenuItem>
                <User />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem>
                <Settings />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* <DropdownMenuGroup>
            <Link href="//passwords/new">
              <DropdownMenuItem>
                <Plus />
                <span>Add New Password</span>
                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator /> */}
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAccountDropDown;
