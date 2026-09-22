// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// All HTML pages use SiteLayout directly. This keeps the shared navigation and
// footer in one place and avoids mutating page source during the Vite build.

// https://astro.build/config
export default defineConfig({
  site: "https://8paycommission.com",
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
