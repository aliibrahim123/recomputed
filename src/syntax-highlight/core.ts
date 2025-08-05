import { query } from '@neocomp/full/rawdom';
import 'prismjs';
import 'prismjs/components/prism-jsx.js';
//import 'prismjs/plugins/unescaped-markup/prism-unescaped-markup.js'

globalThis.Prism.manual = true;

globalThis.Prism.hooks.add("before-highlight", function (env) {
    env.code = (env.element as HTMLElement).innerText;
});

export function highlight () {
	for (const code of query('code')) {
		let raw = '';
		if (code.firstChild instanceof Comment) raw = code.firstChild.data;
		else raw = code.innerText;
		raw = raw.replace(/^\s*?\n(\s*?\n)/g, '');
		if (code.parentElement?.tagName === 'PRE') 
			code.innerText = raw.replaceAll(`${raw.match(/\n\t*/)?.[0]}`, '\n').trim();
		globalThis.Prism.highlightElement(code);
	}
}