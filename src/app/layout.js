import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import { PresenceProvider } from "@/context/PresenceContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Connect Vibe",
  description: "Dost ki vibe sa connect kro!",
  icons: {
    icon: "/favicon.ico",

    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="60DnIXcZogDPYNWq4_TsY8neI2B6Q8vEw-0jKfD2Vjc" />
        <meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  hide-scrollbar`}
      >
        <AuthProvider>
          <PresenceProvider>
            {children}
          </PresenceProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#fff",
                color: "#0866FF",
                border: "1px solid #444",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
