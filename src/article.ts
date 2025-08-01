import { Component, registry, type BaseMap, type CompOptions } from "@neocomp/full/comp-base";
import { query } from "@neocomp/full/rawdom";
import { links } from "./links.ts";
import { $template } from "@neocomp/full/comp-base/tempGen";

interface TypeMap extends BaseMap {
	props: {
		title: string,
		content: Element[],
		created: string,
		rootHref: string,
		contentWidth: string
	},
	refs: {
		content: HTMLElement
	}
}

const template = $template(/* html */`<neo:template id="article" class="min-h-screen flex flex-col">
	<header class="
	  bg-linear-180 dark:from-indigo-900/70 dark:to-slate-900/90 from-gray-200 to-gray-400/70 
	  sm:px-10 px-5 py-4
	">
		<h1 class="font-mono text-4xl text-center font-semibold" .text>\${title}</h1>
	</header>
	<article class="lg:px-20 px-3 sm:px-10 py-3 leading-5! mx-auto" 
	  @effect(...)="
		const width = comp.get('contentWidth');
		el.classList.toggle('max-w-full!', width === '100%');
		el.classList.toggle('max-w-[100ch]!', width === '100ch');
		el.classList.toggle('max-w-[120ch]!', width === '120ch');
	  "
	>
		<div class="text-gray-500 flex flex-row gap-3 justify-end pr-3">
			<span><b>words:</b><span .text> $(){
				comp.get('content').map(e => e.innerText.trim().split(/\\s+/).length)
				.reduce((a, b) => a + b)	
			}</span></span>
			<span><b>created:</b><span .text> \${created}</span></span>
		</div>
		<div .content(content)="{content}" @ref="content" class="
		  prose prose-p:my-3 prose-headings:mb-2 prose-headings:mt-2 dark:prose-invert max-w-none
		"></div>
	</article>
	<div class="grow-1"></div>
	<footer @comp:this="footer" @out(contentWidth)="contentWidth" .arg:rootHref="{comp.get('rootHref')}"></footer>
</neo:template>`)

class Article extends Component<TypeMap> {
	static override template = template;
	static override defaults: CompOptions = {
		...Component.defaults,
		store: { addUndefined: true },
		view: { insertMode: 'replace' }
	};
	constructor (el?: HTMLElement) {
		super(el);
		this.set('rootHref', this.el.getAttribute('root-href') || './');

		const info = this.query('#info')[0];
		this.set('title', query('[prop=title]', info)[0].innerText);
		this.set('created', query('[prop=created]', info)[0].innerText);

		this.set('content', Array.from(this.el.children).slice(1));
		for (const anchor of this.query<HTMLAnchorElement>('a[-href]')) {
			anchor.href = links[anchor.getAttribute('-href')!];
		}
		this.initDom();

		this.set('contentWidth', localStorage.getItem('contentWidth') || '120ch');
		router.attachToDom();

		this.fireInit()
	}
}

registry.add('article', Article);