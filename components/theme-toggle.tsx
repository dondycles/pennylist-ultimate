"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="ghost"
      size="icon"
      className="rounded-full"
    >
      <SunIcon size={24} className="dark:scale-0 scale-100" />
      <MoonIcon size={24} className="absolute scale-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
