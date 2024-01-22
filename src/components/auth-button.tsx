"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn, formatName } from "@/lib/utils";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

interface AuthButtonType extends React.HTMLAttributes<HTMLDivElement> {
  provider: string;
}
const AuthButton = ({ provider, className }: AuthButtonType) => {
  const [loading, setLoading] = useState(false);
  const providerName = formatName({ name: provider });
  const { toast } = useToast();

  const loginHandler = async () => {
    setLoading(true);
    try {
      await signIn(provider ,{
        callbackUrl: "/",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error while logging in",
        description: "Something went wrong with Authentication try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      isLoading={loading}
      onClick={loginHandler}
      className={cn(
        "text-primaryText flex items-center gap-5 border border-slate-300 bg-transparent hover:bg-transparent",
        className,
      )}
    >
      {loading ? null : (
        <Image
          src={`/${provider}.png`}
          alt={`${providerName} logo`}
          width={22}
          height={22}
        />
      )}
      Continue with {providerName}
    </Button>
  );
};

export default AuthButton;
