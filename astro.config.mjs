// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	site: 'https://aliibrahim123.github.io',
	base: '/recomputed',
	trailingSlash: 'never',
	integrations: [
		starlight({
			title: 'ReComputed',
			description: 'articlebase about computed related things.',
			tableOfContents: { minHeadingLevel: 1, maxHeadingLevel: 3 },
			social: [
				{ icon: 'email', label: 'Email', href: 'mailto:ali.ibrahim.dev.1548@gmail.com' },
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/aliibrahim123' },
			],
			lastUpdated: true,
			titleDelimiter: '/',
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
	experimental: {
		contentIntellisense: true,
	},
});
