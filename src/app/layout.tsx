import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Chat Frame",
  description: "A social network built with Next.js, React, and tRPC.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} min-h-screen antialiased`}>
        <TRPCReactProvider>
          <div className="h-full antialiased">{children}</div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
