import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Đọng Lại Trong Tim | Show Âm Nhạc Gây Quỹ",
  description: "Show âm nhạc acoustic Đọng Lại Trong Tim - Nơi gắn kết yêu thương và sẻ chia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-warm-cream text-warm-dark min-h-screen flex flex-col`}
      >
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
