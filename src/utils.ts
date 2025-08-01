import type { PureComp } from "@neocomp/full/comp-base";

// used as meta function for tailwing intellesence
export function tw(str: TemplateStringsArray) { return str[0].split(/\s+/).filter(Boolean); }

export function defined <T> (v: T | null | undefined) { return v as T }

export function microWalk (comp: PureComp, el: HTMLElement) {
	for (const attr of el.attributes) 
		if (attr.name === '@do') new Function('comp', 'el', attr.value)(comp, el);
		else if (attr.name === '@ref') {
			if (attr.value.endsWith('[]')) comp.view.addRef(attr.value.slice(0, -2), [el]);
			else comp.view.addRef(attr.value, el);
		}
	for (const child of el.children) 
		microWalk(comp, child as HTMLElement);
}