import { type QueryClient } from "@tanstack/react-query";

export const invalidateQuery = async (
  queryKeys: string[],
  queryClient: QueryClient,
) => {
  if (!queryClient) return;
  await Promise.all(
    queryKeys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  );
};
