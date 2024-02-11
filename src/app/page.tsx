import { SignIn } from "./_components/SignIn";
import { getServerAuthSession } from "@/server/auth";
import HomePage from "./_components/home/home";

export default async function Home() {
  const session = await getServerAuthSession();

  return <main>{session?.user ? <HomePage /> : <SignIn />}</main>;
}
