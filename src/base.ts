import { ZRORouter } from '@neocomp/full/zro-router';
import { Component, defer, registry } from '@neocomp/full/comp-base'
import { query } from '@neocomp/full/rawdom';
import './footer.ts';
import { tw } from './utils.ts';
import { Footer } from './footer.ts';

declare global {
	var router: ZRORouter;
}

class PageComp extends Component {
	constructor (el: HTMLElement) {
		super(el);
		const { $temp } = this.createTop();
		let firstEl = this.el.children[0];
		
		$temp`<div class="min-h-screen flex flex-col">
			<header ${defer((el) => { if (firstEl.tagName === "HEADER") el.replaceWith(firstEl)})}
			  class="
				bg-linear-180 dark:from-indigo-900/70 dark:to-slate-900/90 from-gray-200 to-gray-400/70 
	  			sm:px-10 px-5 py-4 sm:py-6
			">
				<h1 class="font-mono sm:text-5xl text-4xl text-center font-semibold">
				  ${el.getAttribute('title')}
				</h1>
			</header>
			<div>${el.children}</div>
			<div class="grow"></div>
			${new Footer(el.getAttribute('root-href') || '')}
		</div>`;
		this.fireInit();

		for (let el of this.query('[repeatClass]')) repeatClass(el, el.getAttribute('repeatClass')!);
	}
}
registry.add('page', PageComp);

globalThis.router = new ZRORouter();

function update () {
	if (registry.root) registry.removeRoot();
	const rootEl = query('#root')[0];
	const rootComp = new (registry.get(rootEl.getAttribute('comp-name') || ''))(rootEl) as any;
	registry.setRoot(rootComp);
}
router.onAfterUpdate.listen(update);
update();

document.body.classList.add(...tw`bg-gray-50 dark:bg-slate-950 dark:text-white`);

router.attachToDom();