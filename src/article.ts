import { Component, registry, type BaseMap, type CompOptions } from "@neocomp/full/comp-base/core.ts";
import template from './template/article.neo.html';

interface TypeMap extends BaseMap {
	props: {
		title: string,
		content: Element[],
		rootHref: string,
		contentWidth: string
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
		this.set('title', this.query('#title')[0].innerText);
		this.set('content', Array.from(this.el.children).slice(1));
		this.initDom();
		this.set('contentWidth', localStorage.getItem('contentWidth') || '120ch');
		router.attachToDom();
	}
}
registry.add('article', Article);