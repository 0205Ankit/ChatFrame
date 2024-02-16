import { SignIn } from "./_components/SignIn";
import { getServerAuthSession } from "@/server/auth";
import HomePage from "./_components/home/home";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="mx-auto pl-[100px] md:w-[700px] lg:w-[800px] xl:w-[1000px]">
      {session?.user ? <HomePage /> : <SignIn />}
    </main>
  );
}
