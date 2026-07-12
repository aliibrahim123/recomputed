// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import autoDrafts from 'starlight-auto-drafts';
import { starlightBasePath } from 'starlight-base-path';

let tsrx_grammer = await fetch(
	'https://raw.githubusercontent.com/Ripple-TS/ripple/refs/heads/main/grammars/textmate/ripple.tmLanguage.json',
).then((res) => res.json());

export default defineConfig({
	site: 'https://aliibrahim123.github.io',
	base: '/recomputed/',
	trailingSlash: 'never',
	integrations: [
		starlight({
			title: 'ReComputed',
			description: 'articlebase about computed related things.',
			favicon: './logo.svg',
			logo: { src: './public/logo.svg', alt: 'ReComputed' },
			tableOfContents: { minHeadingLevel: 1, maxHeadingLevel: 3 },
			social: [
				{ icon: 'email', label: 'Email', href: 'mailto:ali.ibrahim.dev.1548@gmail.com' },
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/aliibrahim123' },
			],
			sidebar: [
				{ link: 'base_index', label: 'Index' },
				{ link: 'chrono_index', label: 'Chrono Index' },
				{ link: 'tag_index', label: 'Tag Index' },
				{
					label: 'Web and UI',
					items: [{ autogenerate: { directory: 'Web and UI', collapsed: false } }],
				},
			],
			lastUpdated: true,
			pagination: false,
			customCss: ['./src/styles/theme.css'],
			components: {
				Head: './src/components/HeadOverride.astro',
				ThemeProvider: './src/components/ForceDarkTheme.astro',
				ThemeSelect: './src/components/EmptyComponent.astro',
				TableOfContents: './src/components/TableOfContentOverride.astro',
			},
			expressiveCode: {
				tabWidth: 4,
				shiki: { langs: [tsrx_grammer] },
				styleOverrides: {
					borderRadius: '0.5rem',
					frames: {
						editorActiveTabIndicatorTopColor: 'unset',
						editorActiveTabIndicatorBottomColor: 'var(--sl-color-accent-high)',
						editorTabBarBorderBottomColor: 'var(--sl-color-gray-4)',
						editorTabBarBackground: '#0e0f14',
					},
				},
			},
			plugins: [autoDrafts(), starlightBasePath()],
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
