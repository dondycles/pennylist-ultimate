import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme";
import QueryProvider from "@/components/providers/query";
import { ListDataProvider } from "@/components/providers/list";

const raleway = localFont({
  src: "./fonts/Raleway.ttf",
  variable: "--font-raleway",
});

const readex = localFont({
  src: "./fonts/ReadexPro.ttf",
  variable: "--font-readex",
});

export const metadata: Metadata = {
  title: "pennylist.",
  description: "Avoid becoming penniless, start using pennylist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="en">
        <body
          className={`${readex.variable} ${raleway.variable} font-raleway font-medium antialiased h-[100dvh]`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <ListDataProvider>{children}</ListDataProvider>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
