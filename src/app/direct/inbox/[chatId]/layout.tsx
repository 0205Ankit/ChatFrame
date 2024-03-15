import { getServerAuthSession } from "Frontend/src/server/auth";
import { redirect } from "next/navigation";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  return <div>{children}</div>;
}
