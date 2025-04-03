"use client";

import React from "react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="mr-2 h-9 w-9"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
};

export default ThemeToggler;
