import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import ChatList from "./components/chatList";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Chat",
  description: "A social network built with Next.js, React, and tRPC.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

// const sideBarWidth = "w-[250px]";

export default async function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex min-h-screen bg-background pl-20 font-sans antialiased",
          inter.variable,
        )}
      >
        <ChatList />
        <div className="h-full w-full antialiased">{children}</div>
      </body>
    </html>
  );
}
