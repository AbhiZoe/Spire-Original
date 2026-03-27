import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ShellWrapper } from "@/components/layout/ShellWrapper";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spire — Advance Your Career with Structured Learning",
  description:
    "Spire is a course subscription platform offering expert-led, structured learning paths to help you advance your career in tech, design, and data science.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#1a1a1a] font-sans">
        <AuthProvider>
          <ShellWrapper>{children}</ShellWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
