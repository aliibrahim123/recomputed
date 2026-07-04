import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

const tags = [
	'unimap',
	'neoview',
	'neocomp',
	'madness',
	'gramex',
	'structom',
	'mep',
	'teep',
	'language design',
	'web',
	'rust',
	'js',
	'ts',
] as const;

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				date: z.union([z.date(), z.string()]).optional(),
				tags: z.array(z.enum(tags)).optional(),
				a: z.enum(['a', 'b']).optional(),
			}),
		}),
	}),
};
