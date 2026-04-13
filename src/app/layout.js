import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Facebook | Clone",
  description: "Final Year Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="60DnIXcZogDPYNWq4_TsY8neI2B6Q8vEw-0jKfD2Vjc" />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased  hide-scrollbar`}
      >
        <AuthProvider>
          {children}
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
