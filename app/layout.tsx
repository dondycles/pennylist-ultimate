import type { Metadata, Viewport } from "next";
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

const APP_NAME = "pennylist.";
const APP_DEFAULT_TITLE = "pennylist.";
const APP_TITLE_TEMPLATE = "%s - pennylist";
const APP_DESCRIPTION = "Avoid becoming penniless, start using pennylist.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ultimate.pennylist.app"),
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [
      {
        url: new URL("https://ultimate.pennylist.app" + "/summary.png"),
        width: 1594,
        height: 922,
        alt: "Pennylist",
      },
    ],
    url: new URL("https://ultimate.pennylist.app"),
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [
      {
        url: new URL("https://ultimate.pennylist.app" + "/summary.png"),
        width: 1594,
        height: 922,
        alt: "Pennylist",
      },
    ],
    creator: "@dondycles",
  },
  creator: "John Rod Dondoyano",
  authors: {
    name: "John Rod Dondoyano",
    url: "https://johnroddondoyano.com",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={"/"}
      appearance={{
        elements: {
          formFieldInput: "rounded-full py-2 bg-muted/50 text-foreground",
          button: "rounded-full",
          rootBox: "rounded-3xl overflow-hidden",
          card: "bg-transparent",
          footer: "hidden",
          main: "h-fit max-h-fit",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          formFieldLabel: "text-muted-foreground",
          formFieldInfoText: "text-muted-foreground",
          formButtonPrimary:
            "bg-foreground text-background hover:bg-foreground/50 py-2 font-normal text-sm",
          buttonArrowIcon: "hidden",
        },
      }}
    >
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
