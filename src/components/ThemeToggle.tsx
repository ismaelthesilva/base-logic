"use client";

import React from "react";
import { Button } from "./ui/button";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 px-0 hover:bg-accent hover:text-accent-foreground transition-all duration-300 rounded-md"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative overflow-hidden">
        <div
          className={`transition-all duration-500 ${
            theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
          }`}
        >
          <Sun className="h-4 w-4 text-orange-500 dark:text-yellow-400" />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            theme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
        >
          <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        </div>
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
