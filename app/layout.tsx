import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Zerly Gamers - #1 Top Up Game Terpercaya & Instan",
  description: "Top up game favoritmu dengan harga terbaik, proses instan, dan 100% aman di Zerly Gamers! Top Up Robux, Mobile Legends, Free Fire, dan lainnya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#FFF2F6] text-gray-800 min-h-screen selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
