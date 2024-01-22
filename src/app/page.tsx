import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { SignIn } from "./_components/SignIn";

export default async function Home() {
  return (
    <main>
      <SignIn />
    </main>
  );
}
