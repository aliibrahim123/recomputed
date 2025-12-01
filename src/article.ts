import { $in, Component, defer, registry } from "@neocomp/full/comp-base";
import { create, query } from "@neocomp/full/rawdom";
import { links } from "./links.ts";
import { highlight } from "./syntax-highlight/core.ts";
import { Footer } from "./footer.ts";

class Article extends Component {
	constructor (el: HTMLElement) {
		super(el);
		const build = this.createTop();
		let $temp = build.$temp;
		$temp`<div id="article" class="min-h-screen flex flex-col" ${defer(() => this.el.style.display = '')}>`;

		// header
		let title = query('[prop=title]', el)[0].innerText;
		$temp`<header class="
	  		bg-linear-180 dark:from-indigo-900/70 dark:to-slate-900/90 from-gray-200 to-gray-400/70 
	  		sm:px-10 px-5 py-4
		">
			<h1 class="font-mono sm:text-4xl text-3xl text-center font-semibold">${title}</h1>
		</header>`;

		// main section
		let contentWidth = this.signal('');
		$temp`<article class="lg:px-20 px-3 sm:px-10 py-3 leading-5! mx-auto" ${el => this.effect(() => {
			el.classList.toggle('max-w-full!', contentWidth.value === '100%');
			el.classList.toggle('max-w-[100ch]!', contentWidth.value === '100ch');
			el.classList.toggle('max-w-[120ch]!', contentWidth.value === '120ch');
		})}>`;
		
		let content = Array.from(el.children).slice(1) as HTMLElement[];

		// stats
		let created = query('[prop=created]', el)[0].innerText;
		let words = 0, characters = 0;
		for (let el of content) {
			let text = el.innerText.trim().split(/\s+/);
			words += text.length;
			for (let word of text) characters += word.length;
		}
		$temp`<div class="text-gray-500 flex flex-row gap-3 justify-end pr-3">
			<span><b>words: </b><span>${words}</span></span>
			<span><b>characters: </b><span>${characters}</span></span>
			<span><b>created: </b><span>${created}</span></span>
		</div>`;

		// content container
		$temp`<div class="
		  prose prose-p:my-3 prose-headings:mb-4 prose-headings:mt-6 prose-hr:mt-4 prose-hr:mb-8 
		  prose-code:before:content-[''] prose-code:after:content-[''] dark:prose-invert max-w-none
		">${content}</div>`;

		// end section
		let footer = new Footer(el.getAttribute('root-href')!);
		$in(footer.contentWidth, contentWidth);
		$temp`</article> <div class="grow"></div> `;
		$temp`${footer} </div>`;

		build.end();

		// highlight
		for (let el of this.query('.closable-code')) this.closableCode(el);
		if (this.el.hasAttribute('highlight')) highlight();
		for (let el of this.query<HTMLDetailsElement>('details[open]')) el.open = false;

		// handle links
		for (const anchor of this.query<HTMLAnchorElement>('a[-href]')) 
			anchor.href = links[anchor.getAttribute('-href')!];
		router.attachToDom();

		this.fireInit();
	}

	closableCode (el: HTMLElement) {
		el.replaceWith(this.$chunk`<div><details open 
		  class="
			my-2 open:pb-0 rounded-2xl inline-block border-4 bg-gray-100 dark:bg-slate-900 	
			rounded-b-2xl border-gray-300/60 dark:border-slate-800/60
		">
			<summary class="
				text-center font-semibold bg-gray-300 dark:bg-slate-800 pl-2 p-1.5 border-3 
				border-gray-400/40 dark:border-slate-700/50 rounded-xl
			">${el.getAttribute('title')}</summary>
			<div class="px-2"><pre>
			  <code class=${{['language-' + el.getAttribute('lang')]: true}}>
				${el.firstChild}
			  </code>
			</pre></div>
		</details></div>`)
	}
}

registry.add('article', Article);