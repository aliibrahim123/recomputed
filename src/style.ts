import { defined } from "./utils.ts";

export type ContentWidth = '120ch' | '100%';

if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'system');
export function updateTheme() {
	document.documentElement.classList.toggle("dark",
		localStorage.theme === "dark" ||
		(localStorage.theme === 'system' && window.matchMedia("(prefers-color-scheme: dark)").matches)
	);
}
updateTheme();

//syntax: (\.\d)*\.n
export function repeatClass (el: HTMLElement, source: string) {
	//split path
	const path = source.split('.').slice(1);

	//get top element
	let curParent = defined(el.parentElement);
	for (let i = 0; i < (path.length -1); i++) 
		curParent = defined(curParent.parentElement);

	//get source element
	let curChild = curParent;
	curChild = curChild.children[0] as HTMLElement;
	for (const ind of path.slice(0, -1)) 
		curChild = curChild.children[Number(ind)] as HTMLElement;

	//clone classes
	el.classList.add(...curChild.classList);
}

declare global {
	var repeatClass: (el: HTMLElement, source: string) => void;
} 
globalThis.repeatClass = repeatClass;