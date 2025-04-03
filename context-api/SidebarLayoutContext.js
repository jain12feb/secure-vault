"use client";

import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";

const SidebarLayoutContext = createContext();

export function SidebarLayoutProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarLayout, setSidebarLayout] = useState("sidebar");
  const [defaultOpen, setDefaultOpen] = useState(false);

  useEffect(() => {
    const storedOpen = Cookies.get("sidebar:state") === "true";
    const storedLayout =
      window.localStorage.getItem("sidebar:layout") || "sidebar";
    setDefaultOpen(storedOpen);
    setSidebarLayout(storedLayout);
  }, []);

  return (
    <SidebarLayoutContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        sidebarLayout,
        setSidebarLayout,
        defaultOpen,
      }}
    >
      {children}
    </SidebarLayoutContext.Provider>
  );
}

export function useSidebarLayout() {
  const context = useContext(SidebarLayoutContext);
  if (context === undefined) {
    throw new Error(
      "useSidebarLayout must be used within a SidebarLayoutProvider"
    );
  }
  return context;
}
