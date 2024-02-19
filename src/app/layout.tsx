import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import SideBar from "@/app/_components/sidebar";
import Providers from "@/lib/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Chat Frame",
  description: "A social network built with Next.js, React, and tRPC.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

// const sideBarWidth = "w-[250px]";

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
        <Providers>
          <div className="custom-scrollbar relative flex h-full overflow-y-scroll">
            <div>{session?.user && <SideBar />}</div>
            <div className="h-full w-full antialiased">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
