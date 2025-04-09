import { ZRORouter } from '@neocomp/full/zro-router/index.ts';
import { Component, registry, type AnyComp, type BaseMap, type CompOptions } from '@neocomp/full/comp-base/core.ts'
import { query } from '@neocomp/full/rawdom/index.ts';
import './footer.ts';
import '@neocomp/full/build/module.d.ts';
import { repeatClass } from './style.ts';

declare global {
	var router: ZRORouter;
}

class BareComp extends Component<BaseMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		initMode: 'minimal',
		view: { insertMode: 'none', walkInPreContent: true }
	};
	override init() {}
}
registry.add('bare', BareComp);

globalThis.router = new ZRORouter();

function update () {
	if (registry.root) registry.removeRoot();
	const rootEl = query('#root')[0];
	const rootComp = new (registry.get(rootEl.getAttribute('comp-name') || ''))(rootEl) as any;
	registry.setRoot(rootComp);
}
router.onAfterUpdate.on(update);
update();

router.attachToDom();