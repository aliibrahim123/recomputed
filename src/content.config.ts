import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

const tags = ['orange', 'blue', 'red', 'green', 'yellow', 'purple'] as const;

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
