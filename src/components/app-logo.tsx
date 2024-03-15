import { cn } from "Frontend/src/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AppLogo = ({
  className,
  shrink,
}: {
  className?: string;
  shrink?: boolean;
}) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 text-2xl font-extrabold",
        className,
      )}
    >
      <Image src="/logo.png" alt="Logo" width={32} height={32} />
      {!shrink && (
        <h2>
          Chat<span className="text-primary">Frame</span>
        </h2>
      )}
    </Link>
  );
};

export default AppLogo;
