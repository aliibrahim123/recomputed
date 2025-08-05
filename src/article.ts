import { Component, registry, type BaseMap, type CompOptions, type Template } from "@neocomp/full/comp-base";
import { create, query } from "@neocomp/full/rawdom";
import { links } from "./links.ts";
import { $template, walkInDom } from "@neocomp/full/comp-base/tempGen";
import { highlight } from "./syntax-highlight/core.ts";

interface TypeMap extends BaseMap {
	props: {
		title: string,
		content: Element[],
		created: string,
		rootHref: string,
		contentWidth: string
	},
	refs: {
		content: HTMLElement,
	}
}

const template = $template(/* html */`<neo:template id="article" class="min-h-screen flex flex-col">
	<header class="
	  bg-linear-180 dark:from-indigo-900/70 dark:to-slate-900/90 from-gray-200 to-gray-400/70 
	  sm:px-10 px-5 py-4
	">
		<h1 class="font-mono sm:text-4xl text-3xl text-center font-semibold" .text>\${title}</h1>
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
			<span><b>characters:</b><span .text> $(){
				comp.get('content').map(e => e.innerText.replaceAll(/\s+/g, '').length)
				.reduce((a, b) => a + b)
			}</span></span>
			<span><b>created:</b><span .text> \${created}</span></span>
		</div>
		<div .content(content)="{content}" @ref="content" class="
		  prose prose-p:my-3 prose-headings:mb-4 prose-headings:mt-6 prose-hr:mt-4 prose-hr:mb-8 dark:prose-invert max-w-none
		"></div>
	</article>
	<div class="grow-1"></div>
	<footer @comp:this="footer" @out(contentWidth)="contentWidth" .arg:rootHref="{comp.get('rootHref')}"></footer>
</neo:template>`)

class Article extends Component<TypeMap> {
	static override template = template;

	static override chunks = {
		closableCode: $template(/* html */`<neo:template open 
		  @do="comp.onInit.listen(() => context.el.open = false)" 
		  class="my-2 open:pb-0 rounded-2xl inline-block border-4 bg-gray-100 dark:bg-slate-900/100 	
			rounded-b-2xl border-gray-300/60 dark:border-slate-800/60"
		  >
			<summary .text 
			  class="text-center font-semibold bg-gray-300 dark:bg-slate-800 pl-2 p-1.5 border-3 
				border-gray-400/40 dark:border-slate-700/50 rounded-xl"
			>$(){context.title}</summary>
			<div class="px-2"><pre><code .class='language-$(){context.lang}' .text>
				$(){context.el.firstChild.nodeValue}
			</code></pre></div>
		</neo:template>`)
	};

	static override defaults: CompOptions = {
		...Component.defaults,
		store: { addUndefined: true },
		view: { insertMode: 'replace' }
	};
	constructor (el?: HTMLElement) {
		super(el);
		this.el.style.display = '';
		this.set('rootHref', this.el.getAttribute('root-href') || './');

		const info = this.query('#info')[0];
		this.set('title', query('[prop=title]', info)[0].innerText);
		this.set('created', query('[prop=created]', info)[0].innerText);

		if (this.el.hasAttribute('walk')) walkInDom(this, this.el);

		this.set('content', Array.from(this.el.children).slice(1));
		for (const anchor of this.query<HTMLAnchorElement>('a[-href]')) {
			anchor.href = links[anchor.getAttribute('-href')!];
		}
		this.initDom();

		if (this.el.hasAttribute('highlight')) highlight();

		this.set('contentWidth', localStorage.getItem('contentWidth') || '120ch');
		router.attachToDom();

		this.fireInit();
	}
}

registry.add('article', Article);