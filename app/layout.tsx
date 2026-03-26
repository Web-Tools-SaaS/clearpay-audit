import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PayLater Audit — UK BNPL Compliance Checker",
  description:
    "Check if your checkout is ready for FCA BNPL regulation. Get a full compliance audit against FCA PS26/1 in 60 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${ibmPlexMono.variable}`}>
      <body className="min-h-full flex flex-col bg-[#080808] text-white">
        {children}
      </body>
    </html>
  );
}
