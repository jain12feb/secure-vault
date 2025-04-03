"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useToast } from "./ui/use-toast";
import { useTheme } from "next-themes";
import { useSidebarLayout } from "@/context-api/SidebarLayoutContext";
import {
  Shield,
  Home,
  Key,
  Tag,
  Settings,
  LogOut,
  PlusCircle,
  User,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "./ui/sidebar";
import UserAccountDropDown from "./user-account-dd";
import Link from "next/link";
import { Button } from "./ui/button";
import NotificationDropdown from "./NotificationDropdown";

const AppSidebar = ({ children }) => {
  const pathname = usePathname();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const { isSidebarOpen, setIsSidebarOpen, sidebarLayout } = useSidebarLayout();

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    // In a real app, this would clear the auth token and redirect to login
    window.location.href = "/";
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Passwords", href: "/passwords", icon: Key },
    { name: "Categories", href: "/categories", icon: Tag },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const menuActions = [
    { name: "Add New Password", href: "/passwords/new", icon: PlusCircle },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar
        collapsible="icon"
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        variant={sidebarLayout}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8" />
                  <span className="font-bold text-2xl">SecureVault</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuActions.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      asChild
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {/* <SidebarMenuItem>
                  <SidebarMenuButton onClick={toggleTheme}>
                    {theme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {/* <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="mb-2 hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter> */}
      </Sidebar>
      <div className="flex min-h-screen flex-col w-full">
        <div className="h-14 sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between mx-auto w-full mt-2 gap-x-4 mb-6">
            <div className="hidden md:block">
              <SidebarTrigger className="m-1.5" />
            </div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden m-1.5"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2 mr-3">
              <NotificationDropdown />

              {/* <Button
                onClick={toggleTheme}
                variant="ghost"
                size="icon"
                className="mr-2 h-9 w-9"
              >
                {theme === "dark" ? <Sun /> : <Moon />}
              </Button> */}

              <UserAccountDropDown />
            </div>
          </div>
        </div>
        <SidebarInset>
          <div className="flex-1 px-8 py-6">{children}</div>
        </SidebarInset>
      </div>
    </div>
  );
};

export default AppSidebar;
