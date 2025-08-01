import { ZRORouter } from '@neocomp/full/zro-router';
import { Component, registry, type BaseMap, type CompOptions, type Template } from '@neocomp/full/comp-base'
import { query } from '@neocomp/full/rawdom';
import './footer.ts';
import { repeatClass } from './style.ts';
import { $template } from '@neocomp/full/comp-base/tempGen';
import { microWalk, tw } from './utils.ts';

declare global {
	var router: ZRORouter;
}

const template = $template(/* html */`<neo:template class="min-h-screen flex flex-col">
	<header 
	  @do='const firstEl = comp.el.children[0]; if (firstEl.tagName === "HEADER") el.replaceWith(firstEl)' 
	  class="
	  bg-linear-180 dark:from-indigo-900/70 dark:to-slate-900/90 from-gray-200 to-gray-400/70 
	  sm:px-10 px-5 py-4 sm:py-6
	">
		<h1 class="font-mono sm:text-5xl text-4xl text-center font-semibold">Web Development</h1>
	</header>
	<div .content='{Array.from(comp.el.children)}'></div>
	<div class="grow-1"></div>
	<div @comp:this="footer" .arg:rootHref="{comp.el.getAttribute('root-href')}"></div>
</neo:template>`)

class PageComp extends Component<BaseMap> {
	static override template = template;
	constructor (el: HTMLElement) {
		super(el, 'full');
		if (el.hasAttribute('walk')) microWalk(this, el);
	}
}
registry.add('page', PageComp);

globalThis.router = new ZRORouter();

document.body.classList.add(...tw`bg-gray-50 dark:bg-slate-950 dark:text-white`);

function update () {
	if (registry.root) registry.removeRoot();
	const rootEl = query('#root')[0];
	const rootComp = new (registry.get(rootEl.getAttribute('comp-name') || ''))(rootEl) as any;
	registry.setRoot(rootComp);
}
router.onAfterUpdate.listen(update);
update();

router.attachToDom();