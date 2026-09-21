// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

const sharedChromePlugin = () => ({
	name: "shared-site-chrome",
	transform(source, id) {
		if (!id.includes("/src/pages/") || !id.endsWith(".astro") || !source.includes("<html")) {
			return;
		}

		const withImports = source.replace(
			/^---\n/,
			"---\nimport Navigation from '../components/Navigation.astro';\nimport Footer from '../components/Footer.astro';\n",
		);

		return withImports
			.replace(/<body>/, "<body>\n  <Navigation />")
			.replace(/<\/body>/, "  <Footer />\n</body>");
	},
});

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [sharedChromePlugin()],
	},
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
