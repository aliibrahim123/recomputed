---
title: Example Guide
description: A guide in my new Starlight docs site.
---

Guides lead a user through a specific task they want to accomplish, often with a sequence of steps.
Writing a good guide requires thinking about what your users are trying to do.

## Further reading

- Read [about how-to guides](https://diataxis.fr/how-to-guides/) in the Diátaxis framework

- **abc** *a* ***abc***

```js
// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
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
			favicon: './src/assets/logo.svg',
			logo: { src: './src/assets/logo.svg', alt: 'ReComputed' },
			tableOfContents: { minHeadingLevel: 1, maxHeadingLevel: 3 },
			social: [
				{ icon: 'email', label: 'Email', href: 'mailto:ali.ibrahim.dev.1548@gmail.com' },
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/aliibrahim123' },
			],
			lastUpdated: true,
			titleDelimiter: '/',
			customCss: ['./src/styles/global.css'],
			components: {
				Head: './src/components/HeadOverride.astro',
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
			provider: fontProviders.local(),
			name: 'Latin Modern Roman',
			cssVariable: '--font-latin-modern',
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/latinmodern-roman-regular.woff'],
						weight: '400',
						style: 'normal',
					},
					{
						src: ['./src/assets/fonts/latinmodern-roman-italic.woff'],
						weight: '400',
						style: 'italic',
					},
					{
						src: ['./src/assets/fonts/latinmodern-roman-bold.woff'],
						weight: '700',
						style: 'normal',
					},
					{
						src: ['./src/assets/fonts/latinmodern-roman-bolditalic.woff'],
						weight: '700',
						style: 'italic',
					},
				],
			},
		},
	],
	vite: {
		plugins: [tailwindcss()],
	},
	experimental: {
		contentIntellisense: true,
	},
});

```