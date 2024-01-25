import { createNextRouteHandler } from "uploadthing/next";

import { customFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: customFileRouter,
});
