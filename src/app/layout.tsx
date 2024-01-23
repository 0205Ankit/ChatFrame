import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { getServerAuthSession } from "@/server/auth";
import SideBar from "@/components/sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Chat Frame",
  description: "A social network built with Next.js, React, and tRPC.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

const sideBarWidth = "w-[250px]";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <TRPCReactProvider>
          <div className="relative flex">
            <div className={cn(sideBarWidth)}>
              {session?.user && <SideBar className={cn(sideBarWidth)} />}
            </div>
            <div className="custom-scrollbar h-full w-full overflow-y-scroll pl-10 antialiased">
              {children}
            </div>
          </div>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
