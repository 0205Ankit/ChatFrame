"use client";
import { customFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";
import { TRPCReactProvider } from "@/trpc/react";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { SessionProvider } from "next-auth/react";
import React, { type PropsWithChildren } from "react";
import { extractRouterConfig } from "uploadthing/server";
import { SocketProvider } from "./socket.context";

const Providers = (props: PropsWithChildren) => {
  //   const session = useSession();
  return (
    <SessionProvider>
      <NextSSRPlugin
        /**
         * The `extractRouterConfig` will extract **only** the route configs
         * from the router to prevent additional information from being
         * leaked to the client. The data passed to the client is the same
         * as if you were to fetch `/api/uploadthing` directly.
         */
        routerConfig={extractRouterConfig(customFileRouter)}
      />
      <TRPCReactProvider>
        <SocketProvider>{props.children}</SocketProvider>
      </TRPCReactProvider>
      <Toaster />
    </SessionProvider>
  );
};

export default Providers;
