import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./providers/theme-provider";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { template: "%s | PomoPro", default: "PomoPro" },
  description:
    "O PomoPro é uma aplicação de produtividade baseado na técnica Pomodoro.",
  openGraph: {
    title: "PomoPro",
    description:
      "O PomoPro é uma aplicação de produtividade baseado na técnica Pomodoro.",
    url: "https://pomopro.vercel.app",
    siteName: "monnuery.dev",
    images: [
      {
        url: "https://pomopro.vercel.app/og.png",
        width: 1920,
        height: 1080,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "monnuery.dev",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "./icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${plusJakartaSans.className}`}
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
