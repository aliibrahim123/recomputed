import { Component, registry, type BaseMap, type CompOptions, type Template } from "@neocomp/full/comp-base";
import { tw } from "./utils.ts";
import { updateTheme } from './style.ts';
import { $template } from "@neocomp/full/comp-base/tempGen";

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

const template = $template(/* html */`<neo:template id="footer" class="dark:bg-slate-900 bg-gray-200 py-1.5 px-3 flex flex-row gap-3">
	<span class="
	  inline-grid grid-cols-3 gap-0.5 rounded-full 
	  bg-gray-950/8 p-0.75 text-gray-950 dark:bg-white/10 dark:text-white
	">
		<span class="rounded-full *:size-7" @on(click)="comp.set('theme', 'system')" 
		  @effect(theme)="comp.toggleStyle(el, comp.get('theme') === 'system')">
			<svg viewBox="0 0 28 28" fill="none">
			  <path d="M7.5 8.5C7.5 7.94772 7.94772 7.5 8.5 7.5H19.5C20.0523 7.5 20.5 7.94772 20.5 8.5V16.5C20.5 17.0523 20.0523 17.5 19.5 17.5H8.5C7.94772 17.5 7.5 17.0523 7.5 16.5V8.5Z" stroke="currentColor"></path>
			  <path d="M7.5 8.5C7.5 7.94772 7.94772 7.5 8.5 7.5H19.5C20.0523 7.5 20.5 7.94772 20.5 8.5V14.5C20.5 15.0523 20.0523 15.5 19.5 15.5H8.5C7.94772 15.5 7.5 15.0523 7.5 14.5V8.5Z" stroke="currentColor"></path>
			  <path d="M16.5 20.5V17.5H11.5V20.5M16.5 20.5H11.5M16.5 20.5H17.5M11.5 20.5H10.5" stroke="currentColor" stroke-linecap="round"></path>
		</svg>
		</span>
		<span class="rounded-full *:size-7" @on(click)="comp.set('theme', 'light')" 
		  @effect(theme)="comp.toggleStyle(el, comp.get('theme') === 'light')">
			<svg viewBox="0 0 28 28" fill="none">
			  <circle cx="14" cy="14" r="3.5" stroke="currentColor"></circle>
			  <path d="M14 8.5V6.5" stroke="currentColor" stroke-linecap="round"></path>
			  <path d="M17.889 10.1115L19.3032 8.69727" stroke="currentColor" stroke-linecap="round"></path>
			  <path d="M19.5 14L21.5 14" stroke="currentColor" stroke-linecap="round"></path>
			  <path d="M17.889 17.8885L19.3032 19.3027" stroke="currentColor" stroke-linecap="round"></path>
			  <path d="M14 21.5V19.5" stroke="currentColor" stroke-linecap="round"></path>
			  <path d="M8.69663 19.3029L10.1108 17.8887" stroke="currentColor" stroke-linecap="round"></path>
			  <path d="M6.5 14L8.5 14" stroke="currentColor" stroke-linecap="round"></path>
			  <path d="M8.69663 8.69711L10.1108 10.1113" stroke="currentColor" stroke-linecap="round"></path>
			</svg>
		</span>
		<span class="rounded-full *:size-7" @on(click)="comp.set('theme', 'dark')" 
		  @effect(theme)="comp.toggleStyle(el, comp.get('theme') === 'dark')">
			<svg viewBox="0 0 28 28" fill="none">
			  <path d="M10.5 9.99914C10.5 14.1413 13.8579 17.4991 18 17.4991C19.0332 17.4991 20.0176 17.2902 20.9132 16.9123C19.7761 19.6075 17.109 21.4991 14 21.4991C9.85786 21.4991 6.5 18.1413 6.5 13.9991C6.5 10.8902 8.39167 8.22304 11.0868 7.08594C10.7089 7.98159 10.5 8.96597 10.5 9.99914Z" stroke="currentColor" stroke-linejoin="round"></path>
			  <path d="M16.3561 6.50754L16.5 5.5L16.6439 6.50754C16.7068 6.94752 17.0525 7.29321 17.4925 7.35607L18.5 7.5L17.4925 7.64393C17.0525 7.70679 16.7068 8.05248 16.6439 8.49246L16.5 9.5L16.3561 8.49246C16.2932 8.05248 15.9475 7.70679 15.5075 7.64393L14.5 7.5L15.5075 7.35607C15.9475 7.29321 16.2932 6.94752 16.3561 6.50754Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
			  <path d="M20.3561 11.5075L20.5 10.5L20.6439 11.5075C20.7068 11.9475 21.0525 12.2932 21.4925 12.3561L22.5 12.5L21.4925 12.6439C21.0525 12.7068 20.7068 13.0525 20.6439 13.4925L20.5 14.5L20.3561 13.4925C20.2932 13.0525 19.9475 12.7068 19.5075 12.6439L18.5 12.5L19.5075 12.3561C19.9475 12.2932 20.2932 11.9475 20.3561 11.5075Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
			</svg>
		</span>
	</span>
	<span class=" inline-grid grid-cols-3 rounded-full gap-0.5
	bg-gray-950/8 items-center text-gray-950 dark:bg-white/10 dark:text-white">
		<span class="rounded-full py-0.25 px-1 ml-1" @on(click)="comp.set('contentWidth', '100ch')"
		  @effect(contentWidth)="comp.toggleStyle(el, comp.get('contentWidth') === '100ch')"
		>100ch</span>
		<span class="rounded-full py-0.25 px-1 ml-1" @on(click)="comp.set('contentWidth', '120ch')"
		  @effect(contentWidth)="comp.toggleStyle(el, comp.get('contentWidth') === '120ch')"
		>120ch</span>
		<span class="rounded-full py-0.25 px-1 mr-1" @on(click)="comp.set('contentWidth', '100%')"
		  @effect(contentWidth)="comp.toggleStyle(el, comp.get('contentWidth') === '100%')"
		>100%</span>
	</span>
	<a .href="{comp.get('rootHref')}" class="mr-3 text-xl my-auto font-mono ml-auto">ReComputed</a>
</neo:template>`)

export class Footer extends Component<TypeMap> {
	static override template = template;
	static override defaults: CompOptions = {
		...Component.defaults,
		store: { addUndefined: true }
	};
	static selectedClasses = tw`
		bg-white ring inset-ring ring-gray-950/10 inset-ring-white/10 
		dark:bg-gray-700 dark:text-white dark:ring-transparent
	`;
	constructor (el?: HTMLElement, args: { rootHref?: string } = {}) {
		super(el);
		const { rootHref } = { rootHref: '/', ...args, ...this.elementArgs() };
		this.set('rootHref', rootHref);
		this.effect('track', () => {
			localStorage.theme = this.get('theme') || localStorage.theme || 'system';
			updateTheme();
		});
		this.effect('track', () => {
			localStorage.setItem('contentWidth', 
				this.get('contentWidth') || localStorage.getItem('contentWidth') || '120ch'
			);
		});
		
		this.initDom();
		this.fireInit();
	}
	toggleStyle (el: HTMLElement, set: boolean) {
		if (set) el.classList.add(...Footer.selectedClasses);
		else el.classList.remove(...Footer.selectedClasses);
	}
}
registry.add('footer', Footer);