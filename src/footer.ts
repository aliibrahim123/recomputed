import { Component, registry, type BaseMap, type CompOptions } from "@neocomp/full/comp-base/core.ts";
import template from './template/footer.neo.html';
import { tw } from "./utils.ts";
import { updateTheme } from './style.ts';

interface TypeMap extends BaseMap {
	props: {
		theme: string;
		rootHref: string;
		contentWidth: string;
	},
	args: {
		rootHref: string;
	}
}

export class Footer extends Component<TypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		store: { addUndefined: true },
		view: { template: template.footer }
	};
	static selectedClasses = tw`
		bg-white ring inset-ring ring-gray-950/10 inset-ring-white/10 
		dark:bg-gray-700 dark:text-white dark:ring-transparent
	`;
	override init() {
		this.set('rootHref', this.args({ rootHref: '/' }).rootHref);
		this.effect(['theme'], () => {
			localStorage.theme = this.get('theme');
			updateTheme();
		});
		this.set('theme', localStorage.getItem('theme') || 'system');
		this.effect(['contentWidth'], () => 
			localStorage.setItem('contentWidth', this.get('contentWidth'))
		);
		this.set('contentWidth', localStorage.getItem('contentWidth') || '120ch');
		this.initDom();
	}
	toggleStyle (el: HTMLElement, set: boolean) {
		if (set) el.classList.add(...Footer.selectedClasses);
		else el.classList.remove(...Footer.selectedClasses);
	}
}
registry.add('footer', Footer);