import "server-only";
import Firecrawl from "@mendable/firecrawl-js";

export const firecrawl = new Firecrawl({
  apiKey: process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY!,
});