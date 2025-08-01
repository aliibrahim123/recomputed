import { defineConfig, Plugin } from 'vite';
import directoryPlugin from 'vite-plugin-directory-index';
import { resolve, parse } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { neoTempPlugin } from './node_modules/@neocomp/full/src/build/plugin'
import { glob } from 'glob';
import { readFile } from 'node:fs/promises';

//config
export default defineConfig({
	server: {
		port: 8080,
		open: true
	},
	base: '/recomputed/',
	build: {
		target: 'esnext',
		outDir: './dist',
		manifest: true,
		rollupOptions: {
			input: await glob('**/*.html', { ignore: ['dist/**/*.html', '**/*.neo.html'] }),
			preserveEntrySignatures: 'allow-extension'
		}
	},
	plugins: [directoryPlugin(), neoTempPlugin( { macro: true } ), tailwindcss(), htmlPlugin()]
});

//keep id in script and link tags
function htmlPlugin (): Plugin {
	return {
	  name: 'own:html',
	  async transformIndexHtml (result) {
		//match all script / styles
		return result.replaceAll(/<(script|link) [^>]+>/g, (match) => {
			//if link but not stylesheet, do not modify
			const isLink = match.startsWith('<link');
			if (isLink && !match.includes('stylesheet')) return match;
			
			//id = src file name without extension
			const src = match.match(/(src|href)\s*=\s*"(?<path>[^"]+)"/)?.groups?.path || '';
			const id = parse(src).name;
			
			//insert id after tag
			const insertInd = match.indexOf(' ');
			return `${match.slice(0, insertInd)} id="${id}"${isLink ? ` class=preserve-on-route` : ''}${match.slice(insertInd)}`;
		});
	  }
	}
}