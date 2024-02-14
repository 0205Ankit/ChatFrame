"use server";

import { getServerAuthSession } from "@/server/auth";
import { Prisma } from "@prisma/client";

export const getUserDetails = async () => {
  const session = await getServerAuthSession();
  return session?.user;
};
