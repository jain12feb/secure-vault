"use client";

import React from "react";
import { SidebarLayoutProvider } from "./SidebarLayoutContext";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
// Import other providers as needed

export function GlobalProvider({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      // defaultTheme="system"
      // enableSystem
      // disableTransitionOnChange
    >
      <SidebarProvider>
        <SidebarLayoutProvider>
          {/* Add other providers here */}
          {children}
        </SidebarLayoutProvider>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}
