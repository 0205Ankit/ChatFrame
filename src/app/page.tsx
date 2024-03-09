import { getServerAuthSession } from "@/server/auth";
import HomePage from "../components/home/home";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user) return redirect("/login");

  return (
    <main className="mx-auto pl-[100px] md:w-[700px] lg:w-[800px] xl:w-[1000px]">
      <HomePage />
    </main>
  );
}
