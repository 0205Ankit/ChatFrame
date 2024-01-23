import { SignIn } from "./_components/SignIn";
import { getServerAuthSession } from "@/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return <main>{session?.user ? <>you are now logged in</> : <SignIn />}</main>;
}
