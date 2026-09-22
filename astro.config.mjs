// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { dirname, relative, resolve } from "node:path";

import cloudflare from "@astrojs/cloudflare";

/**
 * Add the shared site chrome to legacy page files that still contain their
 * own document structure. New pages should import SiteLayout directly.
 */
const sharedChromePlugin = () => ({
	name: "shared-site-chrome",
	transform(source, id) {
		if (!id.includes("/src/pages/") || !id.endsWith(".astro") || !source.includes("<html")) {
			return;
		}

		// Pages in nested directories need a different relative import path.
		const pageDirectory = dirname(id);
		const componentsDirectory = resolve(process.cwd(), "src/components");
		const navigationImport = relative(pageDirectory, resolve(componentsDirectory, "Navigation.astro"))
			.replaceAll("\\", "/");
		const footerImport = relative(pageDirectory, resolve(componentsDirectory, "Footer.astro"))
			.replaceAll("\\", "/");

		const imports = [
			`import Navigation from '${navigationImport.startsWith(".") ? navigationImport : `./${navigationImport}`}';`,
			`import Footer from '${footerImport.startsWith(".") ? footerImport : `./${footerImport}`}';`,
		].join("\n");

		const withImports = source.replace(/^---\n/, `---\n${imports}\n`);

		return withImports
			.replace(/<body(\s[^>]*)?>/, "$&\n  <Navigation />")
			.replace(/<\/body>/, "  <Footer />\n</body>");
	},
});

// https://astro.build/config
export default defineConfig({
	site: "https://8paycommission.com",
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
