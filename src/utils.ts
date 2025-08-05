import type { PureComp } from "@neocomp/full/comp-base";

// used as meta function for tailwing intellesence
export function tw(str: TemplateStringsArray) { return str[0].split(/\s+/).filter(Boolean); }

export function defined <T> (v: T | null | undefined) { return v as T }