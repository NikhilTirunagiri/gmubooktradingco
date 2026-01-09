import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/AuthContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GMUBookTrade",
  description: "Buy, Sell books with ease.",
  icons: {
    icon: "/Official Logo - 1.jpg",
    shortcut: "/Official Logo - 1.jpg",
    apple: "/Official Logo - 1.jpg",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} antialiased`}
        style={{ fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif' }}
      >
        <AuthProvider>
          <Analytics />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
