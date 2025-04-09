import { Component, registry, type BaseMap, type CompOptions } from "@neocomp/full/comp-base/core.ts";
import template from './template/article.neo.html';
import { query } from "@neocomp/full/rawdom/index.ts";
import { links } from "./links.ts";

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
 
class Article extends Component<TypeMap> {
	static override defaults: CompOptions = { 
		...Component.defaults,
		store: { addUndefined: true },
		view: { template: template.article, insertMode: 'replace' }
	};
	override init() {
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
	}
}
registry.add('article', Article);