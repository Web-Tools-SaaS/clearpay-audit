import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClearPay Audit — UK BNPL Compliance Checker",
  description:
    "Check if your checkout is ready for FCA BNPL regulation. Get a full compliance audit against FCA PS26/1 in 60 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
