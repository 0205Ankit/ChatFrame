import { CAPTION_LENGTH, LOCATION_LENGTH } from "@/lib/constants";
import { z } from "zod";

export const createPostSchema = z.object({
  caption: z.string().max(CAPTION_LENGTH).optional(),
  location: z.string().max(LOCATION_LENGTH).optional(),
  image: z.array(z.string().min(1)).min(1).max(5),
  hideLikes: z.boolean().optional(),
  hideComments: z.boolean().optional(),
});
