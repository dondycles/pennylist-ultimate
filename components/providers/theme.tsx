"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (mounted)
    return (
      <NextThemesProvider {...props}>
        <ProgressBar
          height="4px"
          color="hsl(var(--primary))"
          options={{ showSpinner: false }}
          shallowRouting
        />
        {children}
      </NextThemesProvider>
    );
}
