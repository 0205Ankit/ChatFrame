"use server";

import { getServerAuthSession } from "@/server/auth";

export const getUserDetails = async () => {
  const session = await getServerAuthSession();
  return session?.user;
};