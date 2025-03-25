import { defineConfig, Plugin } from 'vite';
import directoryPlugin from 'vite-plugin-directory-index';
import { resolve, parse } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
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
			input: await glob('**/*.html', { ignore: ['dist/**/*.html'] }),
			preserveEntrySignatures: 'allow-extension'
		}
	},
	esbuild: {
		keepNames: true
	},
	plugins: [directoryPlugin(), tailwindcss(), htmlPlugin()]
});

//keep id in script and link tags
function htmlPlugin (): Plugin {
	return {
	  name: 'own:html',
	  async transformIndexHtml (result) {
		//match all script / styles
		return result.replaceAll(/<(script|link) [^>]+>/g, (match) => {
			//if link but not stylesheet, do not modify
			if (match.startsWith('<link') && !match.includes('stylesheet')) return result;
			
			//id = src file name without extension
			const src = match.match(/(src|href)\s*=\s*"(?<path>[^"]+)"/)?.groups?.path || '';
			const id = parse(src).name;
			
			//insert id after tag
			const insertInd = match.indexOf(' ');
			return `${match.slice(0, insertInd)} id="${id}"${match.slice(insertInd)}`;
		});
	  }
	}
}