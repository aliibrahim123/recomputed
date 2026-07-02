// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	site: 'https://aliibrahim123.github.io',
	base: '/recomputed/',
	trailingSlash: 'never',
	integrations: [
		starlight({
			title: 'ReComputed',
			description: 'articlebase about computed related things.',
			favicon: './src/assets/logo.svg',
			logo: { src: './src/assets/logo.svg', alt: 'ReComputed' },
			tableOfContents: { minHeadingLevel: 1, maxHeadingLevel: 3 },
			social: [
				{ icon: 'email', label: 'Email', href: 'mailto:ali.ibrahim.dev.1548@gmail.com' },
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/aliibrahim123' },
			],
			lastUpdated: true,
			pagination: false,
			customCss: ['./src/styles/theme.css'],
			components: {
				Head: './src/components/HeadOverride.astro',
				ThemeProvider: './src/components/ForceDarkTheme.astro',
				ThemeSelect: './src/components/EmptyComponent.astro',
			},
		}),
	],
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'JetBrains Mono',
			cssVariable: '--font-jetbrains-mono',
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Lora',
			cssVariable: '--font-lora',
		},
	],
	vite: {
		plugins: [tailwindcss()],
	},
	experimental: {
		contentIntellisense: true,
	},
});
